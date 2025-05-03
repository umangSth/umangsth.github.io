
use std::collections::BinaryHeap;
use wasm_bindgen::prelude::*;
use crate::maze::MazeState;
use crate::maze::CellType;
use std::cmp::Reverse;
use std::collections::HashMap;
use super::heuristic;


pub struct BestFirstSolver ;

impl BestFirstSolver {
    pub async fn find_path(
        &mut self,
        match_state: &mut MazeState,
        delay_ms: i32,
    ) ->Result<JsValue, JsValue> {
        let start =  match_state.computer_player;
        let target = match_state.target;
        let rows = match_state.maze_grid.len();
        let cols = match_state.maze_grid[0].len();

    


        let mut pq = BinaryHeap::new(); // priority queue for the BFS
        pq.push(Reverse((heuristic(&start, &target) as i64, start)));

        let mut visited: HashMap<(usize, usize), bool> = HashMap::new(); // visited set for the BFS
        visited.insert(start, true);
    
        let mut parent: HashMap<(usize, usize), Option<(usize, usize)>> = HashMap::new(); // parent set for the BFS

        let moves: [(i32, i32); 4] = [(0, -1), (0, 1), (-1, 0), (1, 0)];


        while let Some(Reverse((_, current))) = pq.pop() {

            if current == target {
                // target found, now backtrack to find the path
                let path = match_state.reconstruct_path_astar(parent, target)?;
                return Ok(JsValue::from_str(&format!("Path found! --> {:?} ", delay_ms)));
            }

            for &(dx, dy) in moves.iter() {
                let new_x = current.0 as i32 + dx;
                let new_y = current.1 as i32 + dy;

                if new_x >= 0 && new_x < cols as i32 &&
                   new_y >= 0 && new_y < rows  as i32 
                {
                    let neighbor = (new_x as usize, new_y as usize);
                    if !visited.contains_key(&neighbor) &&
                     match_state.maze_grid[neighbor.1][neighbor.0] == CellType::Path
                    {
                        visited.insert(neighbor, true);
                        parent.insert(neighbor, Some(current));
                        pq.push(Reverse((heuristic(&neighbor, &target) as i64, neighbor)));
                        
                        match_state.color_cell(neighbor.0, neighbor.1, "lightcoral".to_string());
                        if delay_ms > 0 {
                            crate::maze::sleep(delay_ms).await?;
                        }
                    }
                }
            }
        }

        Err(JsValue::from_str("Target not reachable!"))

    }

}
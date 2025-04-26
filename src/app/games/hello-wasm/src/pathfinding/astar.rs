use crate::CellType;
use wasm_bindgen::prelude::*;
use std::collections::BinaryHeap;
use std::collections::HashMap;
use std::cmp::Reverse;
use crate::MazeState;




pub struct AstarSolver ;

impl AstarSolver {

    pub async fn find_path(
        &mut self,
        match_state: &mut MazeState,
        delay_ms: i32,
    ) -> Result<JsValue, JsValue> {
        let start =  match_state.computer_player ;
        let target = match_state.target;
        let rows = match_state.maze_grid.len();
        let cols = match_state.maze_grid[0].len();


        // initialize the priority queue and visited set
        let mut pq = BinaryHeap::new(); // priority queue for the A*
        pq.push(Reverse((self.heuristic(&start, &target) as i64, start)));

        let mut g_score: HashMap<(usize, usize), f64> = HashMap::new(); // g_score for the A*
        g_score.insert(start, 0.0);
        
        let mut parent: HashMap<(usize, usize), Option<(usize, usize)>> = HashMap::new(); // parent set for the A*
        parent.insert(start, None);

        let moves: [(i32, i32); 4] = [(0, -1), (0, 1), (-1, 0), (1, 0)];
  
        while let Some(Reverse((_, current))) = pq.pop() {
            if current == target {
                // target found, now backtrack to find the path
                let path = match_state.reconstruct_path_astar(parent, target)?;
                return Ok(JsValue::from_str(&format!("Path found! --> current=>{:?}  target=> {:?} ", current, target)));
            }

            let (cx, cy) = current;
            for &(dx, dy) in moves.iter() {
                let new_x = cx as i32 + dx;
                let new_y = cy as i32 + dy;

                if new_x >= 0 && new_x < cols as i32 && 
                   new_y >= 0 && new_y < rows  as i32
                   {
                    let neighbor = (new_x as usize, new_y as usize);
                    if match_state.maze_grid[neighbor.1][neighbor.0] == CellType::Path {
                        let tentative_g_score = g_score.get(&current).unwrap_or(&f64::INFINITY) + 1.0;

                        if tentative_g_score < *g_score.get(&neighbor).unwrap_or(&f64::INFINITY) {
                            parent.insert(neighbor, Some(current));
                            g_score.insert(neighbor, tentative_g_score);
                            let f_score = tentative_g_score + self.heuristic(&neighbor, &target);
                            pq.push(Reverse((f_score as i64, neighbor)));

                            match_state.color_cell(neighbor.0, neighbor.1, "lightcoral".to_string());
                            crate::sleep(delay_ms).await?;
                        }
                    }
                }
            }
        }
      
        Err(JsValue::from_str("Target not reachable!"))
        
    }

    fn heuristic(&self, node: &(usize, usize), target: &(usize, usize)) -> f64 {
        // Manhattan distance is commonly used for 2D grids
        let (x1, y1) = *node; // dereference the tuple
        let (x2, y2) = *target;  // dereference the tuple
        ((x2 as i32 - x1 as i32).abs() + (y2 as i32 - y1 as i32).abs()) as f64
    }
}
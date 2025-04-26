use crate::CellType;
use wasm_bindgen::prelude::*;
use crate::MazeState;
use std::vec::Vec;

pub struct DfsSolver ;

impl DfsSolver {
    pub async fn find_path(
        &mut self,
        match_state: &mut MazeState,
        delay_ms: i32,
    ) -> Result<JsValue, JsValue> {

        let start =  match_state.computer_player;
        let target = match_state.target;
        let rows = match_state.maze_grid.len();
        let cols = match_state.maze_grid[0].len();


        // Initialize the queue and visited set
        let mut queue = Vec::new(); // queue for the DFS
        let mut visited = vec![vec![false; cols]; rows]; // visited set for the DFS
        let mut parent = vec![vec![None; cols]; rows]; // parent set for the DFS
   
        // Add the start node to the queue
        queue.push(start);
        visited[start.1][start.0] = true;

        let moves: [(i32, i32); 4] = [(0, -1), (0, 1), (-1, 0), (1, 0)];

        while let Some(current) = queue.pop() {
            if current == target {
                // target found, now backtrack to find the path
                match_state.reconstruct_path(parent, target)?;
                return Ok(JsValue::from_str(&format!("Path found! --> current=>{:?}  target=> {:?} ", current, target)));
            }

            let (cx, cy) = current;
            for &(dx, dy) in moves.iter() {
                let new_x = cx as i32 + dx;
                let new_y = cy as i32 + dy;

                if new_x >= 0 && new_x < cols as i32 &&
                   new_y >= 0 && new_y < rows  as i32
                   {
                    let (nx_usize, ny_usize) = (new_x as usize, new_y as usize);

                  if match_state.maze_grid[ny_usize][nx_usize]== CellType::Path  && !visited[ny_usize][nx_usize] {
                        visited[ny_usize][nx_usize] = true;
                        parent[ny_usize][nx_usize] = Some(current);
                        queue.push((nx_usize, ny_usize));

                        // color each cell as we visit it and add delay
                        match_state.color_cell(nx_usize, ny_usize, "lightcoral".to_string());
                        crate::sleep(delay_ms).await?;
                   }
                }
            }
        }
        let col_row_value = format!("Target not reachable! --> {:?}  {:?} start: {:?}", rows, cols, start);
        Ok(JsValue::from_str(&col_row_value))
    }
}
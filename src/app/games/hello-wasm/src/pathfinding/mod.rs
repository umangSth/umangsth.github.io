use crate::CellType;
use wasm_bindgen::prelude::JsValue;

pub mod bfs;
pub mod dfs;
pub mod best_first;
pub mod astar;

pub trait PathFindingAlgorithm {
    fn find_path(
        &mut self,
        maze_state: &mut crate::MazeState,
        start: (usize, usize),
        end: (usize, usize),
        grid: &Vec<Vec<CellType>>,
        delay_ms: i32,
    ) -> Result<Option<Vec<(usize, usize)>>, JsValue>;
}


pub fn heuristic( node: &(usize, usize), target: &(usize, usize)) -> f64 {
    // Manhattan distance is commonly used for 2D grids
    let (x1, y1) = *node; // dereference the tuple
    let (x2, y2) = *target;  // dereference the tuple
    ((x2 as i32 - x1 as i32).abs() + (y2 as i32 - y1 as i32).abs()) as f64
}
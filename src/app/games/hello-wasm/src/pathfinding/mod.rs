use crate::CellType;
use wasm_bindgen::prelude::JsValue;

pub mod bfs;
pub mod dfs;
pub mod best_first;
pub mod astar;
pub mod dijkstra;

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
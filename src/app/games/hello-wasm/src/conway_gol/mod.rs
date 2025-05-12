use wasm_bindgen::prelude::*;
use js_sys::Math;
use std::collections::HashSet;



// for logging from Rust to browser console
#[wasm_bindgen]
extern "C" {
    // Use `web_sys`'s global `window` function to get access to the window object
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format!($($t)*)))
}


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}


// define a type for cell positions
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
struct Position {
    row: usize,
    column: usize,
}


#[wasm_bindgen]
pub struct Universe {
    width: usize,
    height: usize,
    cells: Vec<Cell>,
    next_cells: Vec<Cell>, // the second vector for buffering the next generation cells
    changed_cells: HashSet<Position>,
}



impl Universe {
    fn get_index(&self, row: usize, column: usize) -> usize {
        (row * self.width) + column
    }

    fn live_neighbor_count(&self, row: usize, column: usize) -> u8 {
        let mut count = 0;
        // check the 8 neighboring cells 
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
           for delta_col in [self.width - 1, 0, 1].iter().cloned() {
             // skip the center cell meaning the cell itself
             if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);
                count += self.cells[idx] as u8;
           }
        } 
        count
    }
}


#[wasm_bindgen]
impl Universe {
    pub fn new(width: usize, height: usize) -> Universe {
        let size = width * height;
        let cells = (0..size).
            map(|_| {
                if Math::random() > 0.75 {
                    Cell::Alive
                } else {
                    Cell::Dead
                }
            }).collect();
            let next_cells = vec![Cell::Dead; size]; // initialize the next generation cells with dead cells


            // initialize the changed cells set
            let mut changed_cells = HashSet::new();
            for row in 0..height {
                for column in 0..width {
                    changed_cells.insert(Position { row, column });
                }
            }

            Universe {
                width,
                height,
                cells,
                next_cells,
                changed_cells,
            }
    }

    pub fn tick(&mut self) {
        for row in 0..self.height {
            for column in 0..self.width {
                let idx = self.get_index(row, column);
                let cell = self.cells[idx];
                let live_neighbors = self.live_neighbor_count(row, column);

                let next_cell = match (cell, live_neighbors) {
                    // Rule 1: Any live cell with fewer than two live neighbours dies
                    (Cell::Alive, x) if x < 2 => Cell::Dead,

                    // Rule 2: Any live cell with two or three live neighbours lives
                    (Cell::Alive, 2) | (Cell::Alive, 3) => Cell::Alive,

                    // Rule 3: Any live cell with more than three live neighbours dies
                    (Cell::Alive, x) if x > 3 => Cell::Dead,

                    // Rule 4: Any dead cell with exactly three live neighbours becomes alive
                    (Cell::Dead, 3) => Cell::Alive,

                    // all other cells remain in the same state
                    (otherwise, _) => otherwise,                    
                };
                
                // If the cell changed, add it to the changed cells set
                if cell != next_cell {
                    self.changed_cells.insert(Position { row, column });
                    // also add all the neighbors as they might be affected in the next generation
                    for delta_row in [self.height - 1, 0, 1].iter().cloned() {
                        for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                            let neighbor_row = (row + delta_row) % self.height;
                            let neighbor_col = (column + delta_col) % self.width;
                            self.changed_cells.insert(
                                Position { row: neighbor_row, column: neighbor_col }
                            );
                        }
                    }

                }
                self.next_cells[idx] = next_cell;
            }
        }
        // swap the cells and next_cells
        std::mem::swap(&mut self.cells, &mut self.next_cells);
        // self.cells = next;
    }

    // Get the width of the universe
    pub fn width(&self) -> usize {
        self.width
    }

    // Get the height of the universe
    pub fn height(&self) -> usize {
        self.height
    }

    // get a pointer to the cells, for rendering 
    pub fn cells(&self) -> *const Cell{
        self.cells.as_ptr()
    }

    // get the changed cells as a flat array 
    pub fn changed_cells(&self) -> Vec<usize> {
        let mut result = Vec::with_capacity(self.changed_cells.len()*2);
        for pos in &self.changed_cells {
            result.push(pos.row);
            result.push(pos.column);
        }
        result
    }


    pub fn toggle_cell(&mut self, row: usize, column: usize) {
        let idx = self.get_index(row, column);
        self.cells[idx] = match self.cells[idx] {
            Cell::Alive => Cell::Dead,
            Cell::Dead => Cell::Alive,
        };

        // add teh toggled cell and its neighbors to the changed cells set
        self.changed_cells.insert(Position { row, column });
        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                self.changed_cells.insert(
                    Position { row: neighbor_row, column: neighbor_col }
                );
            }
        }
    }


    pub fn clear(&mut self) {
        self.cells = vec![Cell::Dead; self.width * self.height];
        self.next_cells = vec![Cell::Dead; self.width * self.height];

        // mark all cells as changed
        self.changed_cells.clear();
        for row in 0..self.height {
            for column in 0..self.width {
                self.changed_cells.insert(Position { row, column });
            }
        }
    }

    pub fn reset_and_load_pattern(&mut self, pattern_data: Vec<usize>, start_row: usize, start_col: usize) {

        // clear the universe
        self.clear();

        // load the pattern data into the cells
        // pattern_data is a flat: [row1, col1, row2, col2, ...] relative to pattern's 0, 0
        for i in (0..pattern_data.len()).step_by(2) {
            if i + 1 < pattern_data.len() {
                let p_row = pattern_data[i]
                let p_col = pattern_data[i+1]

                // calculate the absolute position of the main grid, with wrapping
                let abs_row = (start_row + p_row) % self.height;
                let abs_col = (start_col + p_col) % self.width;

                if abs_row < self.height && abs_col < self.width { // if within bounds
                    let idx = self.get_index(abs_row, abs_col);
                    self.cells[idx] = Cell::Alive;

                    // mark this cell and its neighbors as changed
                    for dr_offset in [self.height - 1, 0, 1].iter().cloned() {
                        for dc_offset in [self.width - 1, 0, 1].iter().cloned() {
                            let neighbor_row = (abs_row + dr_offset) % self.height;
                            let neighbor_col = (abs_col + dc_offset) % self.width;
                            self.changed_cells.insert(
                                Position { row: neighbor_row, column: neighbor_col }
                            );
                        }
                    }
            }
        }
    }




}




#[wasm_bindgen]
pub async fn sleep(ms: i32) -> Result<(), JsValue> {
    let promise = js_sys::Promise::new(&mut |resolve, _| {
            let window = web_sys::window().unwrap();
            window.set_timeout_with_callback_and_timeout_and_arguments_0(
                &resolve,
                ms,
            ).unwrap();
    });
    wasm_bindgen_futures::JsFuture::from(promise).await?;
    Ok(())
}



// wasm implementation
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};
use rand::Rng;
use wasm_bindgen_futures::JsFuture;
use js_sys::{Promise as JsPromise, Function};

mod pathfinding;
use pathfinding::bfs::BfsSolver;




#[derive(Clone, Copy, PartialEq, Debug)]
enum CellType {
    Wall,
    Path,
    // Target,
    // Computer,
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum PlayerType {
    Computer,
    Human,
    Target,
}

#[derive(Clone, Copy, Debug, PartialEq)]
enum Algorithm {
    BFS,
    DFS,
    BEST_FIRST,
    A_STAR,
    DIJKSTRA,
}


#[wasm_bindgen]
pub struct MazeState{
    maze_grid: Vec<Vec<CellType>>,
    computer_player: (usize, usize),
    target: (usize, usize),
    human_player: (usize, usize),
    canvas_context: CanvasRenderingContext2d,
    block_size: f64,
}





// helper function to create a delay
#[wasm_bindgen]
extern "C"{
    #[wasm_bindgen(js_namespace = window)]
    fn setTimeout(closure: &Closure<dyn FnMut()>, time: u32) -> i32;

    #[wasm_bindgen(js_namespace = JsPromise, js_name = resolve)]
    fn resolve(value: JsValue) -> JsPromise;

    #[wasm_bindgen(js_name = setTimeout)]
    fn set_timeout(handler: &Function, timeout: i32) -> i32;
}


async fn sleep(ms: i32) -> Result<(), JsValue> {
    let promise = js_sys::Promise::new(&mut |resolve, _| {
        let window = web_sys::window().unwrap();
        window.set_timeout_with_callback_and_timeout_and_arguments_0(
            &resolve,
            ms,
        ).unwrap();
    });
    JsFuture::from(promise).await?;
    Ok(())
}



#[wasm_bindgen]
impl MazeState {

    pub fn new(canvas_id: &str, maze_data: &str, block_size: f64) -> Result<MazeState, JsValue>{
       let canvas_context = get_context(canvas_id)?;
       let maze_grid = parse_maze(maze_data)?;

       let mut state = MazeState{
           maze_grid,
           computer_player: (0, 0),
           target: (0, 0),
           human_player: (0, 0),
           canvas_context,
           block_size,
       };
       state.draw_maze()?;
       let target_pos = state.generate_random_target()?;
       state.draw_player(target_pos[0], target_pos[1], PlayerType::Target);
       let com_pos = state.generate_random_target()?;
       state.draw_player(com_pos[0], com_pos[1], PlayerType::Computer);

       Ok(state)
    }


    pub fn reset(&mut self)-> Result<(), JsValue> {
        self.computer_player = (0, 0);
        self.target = (0, 0);
        self.human_player = (0, 0);
        self.canvas_context.set_fill_style(&"black".into());
        self.clear_canvas();
        self.draw_maze();
        let target_pos = self.generate_random_target()?;
        self.draw_player(target_pos[0], target_pos[1], PlayerType::Target);
        let com_pos = self.generate_random_target()?;
        self.draw_player(com_pos[0], com_pos[1], PlayerType::Computer);
        Ok(())
    }


    pub fn draw_maze(&mut self)-> Result<(), JsValue> {
        self.canvas_context.set_fill_style(&"black".into());
        self.clear_canvas();

        for (y, row) in self.maze_grid.iter().enumerate() {
            for (x, &cell_type) in row.iter().enumerate() {
                if cell_type == CellType::Wall {
                    self.canvas_context.fill_rect(
                        x as f64 * self.block_size,
                        y as f64 * self.block_size, 
                        self.block_size, 
                        self.block_size,
                    );
                }
            }
        }
        Ok(())
    }

    fn clear_canvas(&mut self) {
        let canvas = self.canvas_context.canvas().unwrap().dyn_into::<HtmlCanvasElement>().unwrap();
        self.canvas_context.clear_rect(0.0, 0.0, canvas.width() as f64, canvas.height() as f64);
    }


    fn generate_random_target(&self)-> Result<Vec<usize>, JsValue> {
       let mut rng = rand::thread_rng();
       const MAX_ATTEMPTS: usize = 50;

       for _ in 0..MAX_ATTEMPTS {
           let x = rng.gen_range(0..self.maze_grid[0].len());
           let y = rng.gen_range(0..self.maze_grid.len());
           if self.maze_grid[y][x] == CellType::Path
           {
                if (x, y) != self.computer_player && (x, y) != self.target {
                    return Ok(vec![x, y]);
                }
           }
       }
       Err(JsValue::from_str("Failed to find a suitable position!"))
    }

    fn draw_player(&mut self, x: usize, y: usize, player_type: PlayerType) {
        match player_type {
            PlayerType::Computer => {
                self.computer_player = (x, y);
                self.canvas_context.set_fill_style(&"red".into());
                self.canvas_context.fill_rect(
                    x as f64 * self.block_size, 
                    y as f64 * self.block_size, 
                    self.block_size, 
                    self.block_size,
                );
            },
            PlayerType::Human => {
                self.human_player = (x, y);
                self.canvas_context.set_fill_style(&"blue".into());
                self.canvas_context.fill_rect(
                    x as f64 * self.block_size, 
                    y as f64 * self.block_size, 
                    self.block_size, 
                    self.block_size,
                );
            },
            PlayerType::Target => {
                self.target =(x, y);
                self.canvas_context.set_fill_style(&"yellow".into());
                self.canvas_context.fill_rect(
                    x as f64 * self.block_size, 
                    y as f64 * self.block_size, 
                    self.block_size, 
                    self.block_size,
                );
            },  
        }
    }

   pub async fn find_path(&mut self, algorithm: &str, delay_ms: i32) -> Result<JsValue, JsValue> {
       match algorithm {
            "BFS" => {
                 let mut bfs_solver = BfsSolver;
                 bfs_solver.find_path(self, delay_ms).await
            },
            _ => {
                Err(JsValue::from_str("Invalid algorithm name!"))
            }
        }
    }



    // helper function to reconstruct the path from the parent set
    fn reconstruct_path(&mut self, parent: Vec<Vec<Option<(usize, usize)>>>, target: (usize, usize)) -> Result<Vec<(usize, usize)>, JsValue> {
        let mut path = Vec::new();
        let mut current = target;
        while let Some(parent_cell) = parent[current.1][current.0] {
            path.push(current);
            current = parent_cell;
            self.color_cell(current.0, current.1, "red".to_string());
        }
        path.push(self.computer_player);
        path.reverse();
        Ok(path)
    }

    // helper function to color a cell
    fn color_cell(&mut self, x: usize, y: usize, color: String) {
        let cell = self.maze_grid[y][x];
        match cell {
            CellType::Path => {
                self.canvas_context.set_fill_style(&color.into());
                self.canvas_context.fill_rect(
                    x as f64 * self.block_size, 
                    y as f64 * self.block_size, 
                    self.block_size, 
                    self.block_size,
                );
            },
            _ => {}
        }
    }
}



fn get_context(canvas_id: &str) -> Result<CanvasRenderingContext2d, JsValue> {
    let window = web_sys::window().unwrap();  // get the window object
    let document = window.document().unwrap();  // get the document object
    let canvas = document 
                    .get_element_by_id(canvas_id)
                    .ok_or_else(|| JsValue::from_str("Could not find canvas element"))?
                    .dyn_into::<HtmlCanvasElement>()?;  // get the canvas element

    let ctx = canvas
        .get_context("2d")?
        .ok_or_else(|| JsValue::from_str("Could not get 2d context"))?
        .dyn_into::<CanvasRenderingContext2d>()?;  // get the 2d context

    Ok(ctx)
}


fn parse_maze(maze_data: &str) -> Result<Vec<Vec<CellType>>, JsValue> {
    let mut maze_grid = Vec::new();
    for (_, row) in maze_data.split('\n').enumerate() {
        let trimmed_row = row.trim_end_matches('\r').trim();
        let mut row_cells = Vec::new();
        for (_, cell) in trimmed_row.chars().enumerate() {
             match cell {
                '*' => row_cells.push(CellType::Wall),
                ' ' => row_cells.push(CellType::Path),
                _ => {
                    let error_message = format!("Invalid maze data!--->{}", cell);
                    return Err(JsValue::from_str(&error_message));
                },
             }
        }
        if !trimmed_row.is_empty() { // Avoid adding empty rows if the last line was empty
                 maze_grid.push(row_cells);
        }
    }
    Ok(maze_grid)
}

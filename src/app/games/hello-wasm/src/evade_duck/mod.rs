use wasm_bindgen::prelude::*;
use std::sync::{Mutex, LazyLock};



const DUCK_SPEED: u16 = 5;
const GRAVITY: u16 = 1;

struct CanvasConfig {
    width: u32,
    height: u32,
}


static SCREEN: Mutex<CanvasConfig> = Mutex::new(CanvasConfig {width: 0, height: 0});


#[wasm_bindgen]
pub fn set_canvas_dimensions(width: u32, height: u32){
    let mut screen = SCREEN.lock().unwrap();
    screen.width = width;
    screen.height = height;
}


static INPUT: LazyLock<Mutex<u32>> = LazyLock::new(|| Mutex::new(1));

struct Duck {
    duck_x: u16,
    duck_y: u16,
}

static DUCK_STATE: LazyLock<Mutex<Duck>> = LazyLock::new(|| {
    Mutex::new(Duck {duck_x: 100, duck_y: 100})
});

#[wasm_bindgen]
pub fn get_duck_co() -> u32 {
 
    apply_gravity();
    let state = DUCK_STATE.lock().unwrap();
    return ((state.duck_x as u32) << 16) | (state.duck_y as u32);
}

// The list of input 
// 1 -> left
// 2 -> right
// 3 -> space (lift)
#[wasm_bindgen]
pub fn set_user_input(input: u32) {
    let mut data = INPUT.lock().unwrap();
    let mut duck_co = DUCK_STATE.lock().unwrap();
    match input {
        1 => {
            *data = 1;
            duck_co.duck_x -= 1;
        }
        2 => {
            *data = 2;
            duck_co.duck_x += 1;
        }
        3 => {
            *data = 3;
        }
        _ => {
           *data = 1;
        }
    }
}



fn apply_gravity(){
    let mut duck = DUCK_STATE.lock().unwrap();
    let screen = SCREEN.lock().unwrap();

    // apply gravity
    duck.duck_y += GRAVITY;

    let update_height = screen.height - 50;
    if (duck.duck_y as u32) >= (update_height) {
        duck.duck_y = update_height as u16;
    }

}

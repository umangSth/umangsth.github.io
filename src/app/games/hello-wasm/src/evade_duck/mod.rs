use wasm_bindgen::prelude::*;
use std::sync::{Mutex, LazyLock};


const DUCK_SPEED: i16 = 3;
const GRAVITY: i16 = 2;
const BUFFER_WIDTH: i16 = 150;

struct CanvasConfig {
    width: u32,
    height: u32,

}
struct ScreenDim {
    width: i16,
    height: i16,
}
struct Duck {
    duck_x: i16,
    duck_y: i16,
    boost_frames: i16,
    boost_dir: i16,
}



static SCREEN: Mutex<CanvasConfig> = Mutex::new(CanvasConfig {width: 0, height: 0});
static INPUT: LazyLock<Mutex<u32>> = LazyLock::new(|| Mutex::new(1));
static DUCK_STATE: LazyLock<Mutex<Duck>> = LazyLock::new(|| {
    Mutex::new(Duck {duck_x: 400, duck_y: 200, boost_frames: 0, boost_dir: -1})
});
static DUCK_FLAP_FLAG: LazyLock<Mutex<bool>> = LazyLock::new(|| Mutex::new(false));
static DUCK_STANDING_FLAG: LazyLock<Mutex<bool>> = LazyLock::new(|| Mutex::new(false));


#[wasm_bindgen]
pub fn set_canvas_dimensions(width: u32, height: u32){
    let mut screen = SCREEN.lock().unwrap();
    screen.width = width;
    screen.height = height;
}



#[wasm_bindgen]
pub fn get_duck_co() -> u32 {
 
    apply_gravity();
    let state = DUCK_STATE.lock().unwrap();

    // ensure values are between 0 and 65535 so they fit in 16 bits safely 
    let x = state.duck_x.max(0) as u32;
    let y = state.duck_y.max(0) as u32;

    return (x << 16) | (y & 0xFFFF);
}



// First bit will be for left and right direction of duck
// second bit will be for the flapping state of the duck
#[wasm_bindgen]
pub fn get_duck_states() -> u8 {
    let flap = *DUCK_FLAP_FLAG.lock().unwrap();
    let stand = *DUCK_STANDING_FLAG.lock().unwrap();
    let duck_dir ={
        let duck_state =  DUCK_STATE.lock().unwrap();
        duck_state.boost_dir != -1
    };
    let mut packed_state:u8 = 0;

    if duck_dir {
        packed_state |= 1 << 0;
    }
    if flap {
        packed_state |= 1 << 1;
    }
    if stand {
        packed_state |= 1 << 2;
    }
    packed_state
}



// The list of input 
// 1 -> right
// 2 -> left
// 3 -> space (lift)
#[wasm_bindgen]
pub fn set_user_input(input: u32) {
    let mut data = INPUT.lock().unwrap();
    let mut duck = DUCK_STATE.lock().unwrap();
    let mut flap = DUCK_FLAP_FLAG.lock().unwrap();
    match input {
        1 => {
            *data = 1;
            duck.boost_frames = 40;
            duck.boost_dir = -1;
            *flap = true;

        }
        2 => {
            *data = 2;
            duck.boost_frames = 40;
            duck.boost_dir = 1;
            *flap = true;
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
    let mut stand = DUCK_STANDING_FLAG.lock().unwrap();
    
    // screen height minus 50px
    let screen = {
        let screen = SCREEN.lock().unwrap();
        ScreenDim {
            height: screen.height as i16 - 50,
            width: screen.width as i16,
        }
    };

    

    // apply gravity/physics for Y-axis
    if duck.duck_y >= screen.height {
        duck.duck_y = screen.height;
        *stand = true;
    }else {
        duck.duck_y += GRAVITY;
        *stand = false;
    }

//------------------------------
    // apply physics for X-axis
    if duck.duck_x <= BUFFER_WIDTH {
        duck.duck_x = BUFFER_WIDTH; 
    } else if duck.duck_x < screen.width{
        if duck.duck_y < screen.height {
            // applying this to show gliding effects
            duck.duck_x += (DUCK_SPEED * duck.boost_dir);
        }       
    } else {
        duck.duck_x = screen.width
    }

//--------------------------------
    // when the boost/lift/flapping 
    if duck.boost_frames > 0 {
        duck.duck_x += (DUCK_SPEED * duck.boost_dir);
        duck.duck_y -= DUCK_SPEED + 3;

        duck.boost_frames -= 1;
    } else {
            *DUCK_FLAP_FLAG.lock().unwrap() = false;
    }
}

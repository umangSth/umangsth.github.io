// wasm_bindgen to bridges Rust and JS
// web_sys to interact with the DOM, canvas, and other web APIs
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement};



// get_context is a function that takes a canvas_id and returns a CanvasRenderingContext2d
// it uses the web_sys crate to interact with the DOM and get the canvas element
// it then uses the get_context function to get the 2d context of the canvas
// it returns the context or an error if it cannot find the canvas element or get the 2d context
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


// wasm_bindgen allows us to use Rust functions in JavaScript
// draw_circle is a function that takes a canvas_id, x, y, radius, and color as parameters
// it uses the get_context function to get the 2d context of the canvas
// it then uses the begin_path, arc, set_fill_style, and fill functions to draw a circle
#[wasm_bindgen]
pub fn draw_circle(canvas_id: &str, x: f64, y: f64, radius: f64, color: &str) {
    let ctx = get_context(canvas_id).unwrap();
    ctx.begin_path();
    ctx.arc(x, y, radius, 0.0, 2.0 * std::f64::consts::PI);
    ctx.set_fill_style(&JsValue::from_str(color));
    ctx.fill();
}


// draw_rect is a function that takes a canvas_id, x, y, width, height, and color as parameters
// it uses the get_context function to get the 2d context of the canvas
// it then uses the set_fill_style and fill_rect functions to draw a rectangle
#[wasm_bindgen]
pub fn draw_rect(canvas_id: &str, x: f64, y: f64, width: f64, height: f64, color: &str) {
    let ctx = get_context(canvas_id).unwrap();
    ctx.set_fill_style(&JsValue::from_str(color));
    ctx.fill_rect(x, y, width, height);
}


// clear_canvas is a function that takes a canvas_id as a parameter
// it uses the get_context function to get the 2d context of the canvas
// it then uses the clear_rect function to clear the canvas
#[wasm_bindgen]
pub fn clear_canvas(canvas_id: &str) {
    let ctx = get_context(canvas_id).unwrap();
    let canvas = ctx.canvas().unwrap().dyn_into::<HtmlCanvasElement>().unwrap();
    ctx.clear_rect(0.0, 0.0, canvas.width() as f64, canvas.height() as f64);
}




#[wasm_bindgen]
pub fn reverse(word: &str) -> String {
    let reversed_word: String = word.chars().rev().collect();
    format!("The reverse of '{word}' is '{reversed_word}'.")
}
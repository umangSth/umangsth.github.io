import {Position, DuckState} from './types';
import { DUCK_DISPLAY_SIZE, DUCK_FRAME_HEIGHT, DUCK_FRAME_WIDTH } from './constants';


// function to load images asynchronously
// this function returns a promise resolving to an HTMLImageElement
// assign src to src attribute image element, onload event resolve the promise with the image element, onerror event reject the promise
export const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(new Error(`Failed to load image: ${src}`));
    })
}

// Function to draw the duck on the canvas
// it takes the canvas context, sprite image, position, frame index, and angle as parameters
export const drawDuck = (
    ctx: CanvasRenderingContext2D,
    sprite: HTMLImageElement,
    position: Position,
    frameIndex: number,
    angle: number = 0,
    direction: 'left' | 'right',
) => {
    ctx.save(); // save the current state of the canvas 
    // Translate to the center of the duck for rotation
    let newAngle = angle; // start with the provided angle
    if (direction === 'left') {
         newAngle = Math.abs(newAngle); // adjust angle for left direction 
    }else {
        // console.log("Angle before right adjustment:", newAngle);
        newAngle = newAngle > 0?-newAngle:newAngle; // ensure angle is positive for right direction
    }
    const centerX = position.x + DUCK_DISPLAY_SIZE / 2;
    const centerY = position.y + DUCK_DISPLAY_SIZE / 2;
    ctx.translate(centerX, centerY); // move origin to duck's center
    ctx.rotate(newAngle)
    ctx.translate(-centerX, -centerY); // move origin back to top-left corner

    // Calculate the source x coordinate based on the frame index
    const sx = frameIndex * DUCK_FRAME_WIDTH;


    ctx.drawImage(
        sprite,  // this is the html image element of the duck sprite
        sx, 0, // source coordinates
        DUCK_FRAME_WIDTH, DUCK_FRAME_HEIGHT, // source dimensions
        position.x, position.y, // destination coordinates
        DUCK_DISPLAY_SIZE, DUCK_DISPLAY_SIZE // destination dimensions
    );

    ctx.restore(); // restore the canvas state to before the translation and rotation
}
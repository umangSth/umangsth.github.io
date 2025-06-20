// types 

export interface Position {
    x: number;
    y: number;
}

export interface DuckState {
    position: Position;  // give the current position of the duck
    velocityY: number;  //  velocity in the Y axis which is vertical movement
    velocityX: number;  // velocity in the X axis which is horizontal movement
    direction: 'left' | 'right'; // current direction of the duck, it can be either left or right
    spriteFrameIndex: number;   // current frame index in the sprite sheet
    animationTimer: number;   // timer to control the animation speed
    currentAngle: number;   // current angle of the duck for incline effect
    animate: 'flap' | 'glide' | 'shot'  // state of the duck,  flap means the sprite is changing creating flapping effects, glide means the duck glide sprite image is shown, for left and right its different sprite index, while shot is not yet create for now
    flapDurationTimer: number; // timer to mark the animation frames, time to tell changing in the sprite frame index

    boostActive: boolean; // whether boost is currently active
    boostStartTime: number | null; // time when boost started
    lastArrowKeyTime: number | null; // last time an arrow key was pressed
    lastArrowKeyPressed: 'ArrowLeft' | 'ArrowRight' | null; // last arrow key pressed
    boostTimeoutId: ReturnType<typeof setTimeout> | null; // timeout ID for boost duration, as the setTimeout return a uqunique Id, we can use it to clear the timeout later
}
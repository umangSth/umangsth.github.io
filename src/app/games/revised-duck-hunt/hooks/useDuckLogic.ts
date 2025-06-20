import {useState, useEffect} from 'react';
import { 
    WIDTH, 
    HEIGHT, 
    DUCK_SPRITE_SRC, 
    DUCK_SPRITE_SRC_LEFT, 
    BACKGROUND_SRC, 
    DUCK_DISPLAY_SIZE, 
    DUCK_FRAME_WIDTH, 
    DUCK_FRAME_HEIGHT, 
    DUCK_SPRITE_TOTAL_FRAMES, 
    DUCK_GLIDE_INDEX_LEFT, 
    DUCK_GLIDE_INDEX_RIGHT, 
    DUCK_SPEED, 
    DUCK_FLAP_VELOCITY_Y, 
    DUCK_INCLINE_ANGLE, 
    GRAVITY, 
    FLAP_DURATION_FRAMES,
    ANIMATION_SPEED, 
    BOOST_MULTIPLIER, 
    SUSTAINED_PRESS_THRESHOLD, 
    DOUBLE_TAP_THRESHOLD, 
    SHORT_BOOST_DURATION 
} from '../utils/constants'; // import the constants for the game
 import { DuckState } from '../utils/types'; // import the types for the game

 export const useDuckLogic = (keysPressed: Set<string>) => {
    const [duck, setDuck] = useState<DuckState>({
        position: { x: WIDTH / 2, y: HEIGHT / 2 },
        velocityY: 0,
        velocityX: 0,
        direction: 'right',
        spriteFrameIndex: 1,
        animationTimer: 0,
        currentAngle: 0,
        animate: 'glide',
        flapDurationTimer: 0,
        boostActive: false,
        boostStartTime: null,
        lastArrowKeyTime: null,
        lastArrowKeyPressed: null,
        boostTimeoutId: null,
    }); // initialize the duck state with default values

    // Effect for handling boost activation from key presses
    useEffect(() => {
        const handleKeyDownBoost = (event: KeyboardEvent) => {
            const now = performance.now();
            const { key } = event;
            
            setDuck((prevDuck) =>{
                 // assign the previsous duck state to new variables
                // this is to avoid mutating the state directly
                let newBoostActive = prevDuck.boostActive;
                let newBoostStartTime = prevDuck.boostStartTime;
                let newLastArrowKeyTime = prevDuck.lastArrowKeyTime;
                let newLastArrowKeyPressed = prevDuck.lastArrowKeyPressed;
                let newBoostTimeoutId = prevDuck.boostTimeoutId;
                // clear any existing boost timeout if a new key interaction starts
                // this is to prevent multiple boost timeouts from stacking up
                // this is to ensure that only one boost timeout is active at a time
                if (newBoostTimeoutId){
                    clearTimeout(newBoostTimeoutId);
                    newBoostTimeoutId = null;
                }

                // check if the key pressed is an arrow key, perform the task based on the key pressed
                if (key === 'ArrowLeft' || key === 'ArrowRight') {
                    // Double-tap detection 
                    // first check if the lastArrow key is same as the current key pressed
                    // then check if the lastArrowKeyTime is not null 
                    // and the time difference between now and lastArrowKeyTime is less then double_tap_threshold constant
                    
                    if (newLastArrowKeyPressed === key && newLastArrowKeyTime !== null && (now - newLastArrowKeyTime < DOUBLE_TAP_THRESHOLD)) {
                        // if the conditions are met, it means a double-tap is detected
                        //  Double-tap detected!, activating boost
                        newBoostActive = true;
                        // set a timeout for the short burst
                        // assigning the timeout id to newBoostTimeoutId
                        // in the timeout function, once the timeout is completed, it will set the duck state to inactive boost
                        // and reset the boostStartTime to null
                        // and the timeout will be cleared based on the Short_BOOST_DURATION constant
                        newBoostTimeoutId = setTimeout(()=> {
                        console.log("Boost deactivated after short burst");
                            setDuck(currentDuck => ({
                                ...currentDuck,
                                boostActive: false,
                                boostStartTime: null,
                            }));
                        }, SHORT_BOOST_DURATION); 

                        // Reset last tap info to prevent triple taps from counting as double 
                            newLastArrowKeyPressed = null;
                            newLastArrowKeyTime = null;
                        //   debugger
                    } else {
                        // update last arrow key info for subsequent taps/sustained press
                        newLastArrowKeyTime  = now;
                        newLastArrowKeyPressed = key;
                        // if not a double tap, check for sustained press
                        newBoostStartTime = now;
                    }
                } else {
                    // if a non-arrow key is pressed, reset arrow key tracking
                    newLastArrowKeyTime = null;
                    newLastArrowKeyPressed = null;
                    newBoostStartTime = null; // also reset sustained press tracking
                    newBoostActive = false; // deactivate boost if non-arrow key is pressed
                }

                // returning the updated duck state
                // this is to update the duck state based on the key pressed

                return {
                    ...prevDuck,
                    boostActive: newBoostActive,
                    boostStartTime: newBoostStartTime,
                    lastArrowKeyTime: newLastArrowKeyTime,
                    lastArrowKeyPressed: newLastArrowKeyPressed,
                    boostTimeoutId: newBoostTimeoutId,
                };
            });
        };

        const handleKeyUpBoost = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                setDuck((prevDuck) => {
                    // Only deactivate boost if it's not a short boost still running
                    if (prevDuck.boostActive && prevDuck.boostTimeoutId === null) {
                        return {
                            ...prevDuck,
                            boostActive: false,
                            boostStartTime: null,
                            boostTimeoutId: null,
                        }
                    } else if (prevDuck.boostTimeoutId) {
                        // clear the short boost timeout if key is released early
                        clearTimeout(prevDuck.boostTimeoutId);
                        return {
                            ...prevDuck,
                            boostActive: false,
                            boostStartTime: null,
                            boostTimeoutId: null,
                        }
                    }
                    return prevDuck; // no change if boost was not active
                })
            }
        }

        // Add event listeners for keydown and keyup events
        window.addEventListener('keydown', handleKeyDownBoost);
        window.addEventListener('keyup', handleKeyUpBoost);

        // Cleanup function to remove event listeners
        return () => {
            window.removeEventListener('keydown', handleKeyDownBoost);
            window.removeEventListener('keyup', handleKeyUpBoost);
        };
    }, []); // only run once on mount


    // Main update logic for duck's position and animation
    const updateDuck = () => {
        // update the duck state based on the keys pressed
        setDuck((prevDuck)=>{
            // assign the previous duck state to new variables so you can update them without mutating the duck state directly
            let newVelocityX = prevDuck.velocityX  // horizontal velocity
            let newVelocityY = prevDuck.velocityY;  // vertical velocity
            let newDirection = prevDuck.direction;  // current direction of the duck, it can be either left or right
            let newAngle = prevDuck.currentAngle; // start with previous angle
            let newAnimate = prevDuck.animate; // current animation state of the duck, it can be either flap or glide
            let newFlapDurationTimer = prevDuck.flapDurationTimer; // timer to control the flap duration
            let newBoostActive = prevDuck.boostActive;  // whether boost is currently active
            const newBoostStartTime = prevDuck.boostStartTime;  // time when boost started
            // let newBoostTimeoutId = prevDuck.boostTimeoutId; // keep existing timeout if any


             // -- check for sustained press boost activation ---
            // only activate sustained boost if an arrow key is currently held down
            // this boost will be active, if the newBoostActive is not of false, newBoostStartTime is not null, keysPressed has either left or right arrow key,
            // and the now time minus newBoostStartTime is greater than or equal to the SUSTAINED_PRESS_THRESHOLD constant
            // this means the user has held down the arrow key for a sustained period
            if (!newBoostActive && newBoostStartTime !== null && (keysPressed.has('ArrowLeft') || keysPressed.has('ArrowRight'))
                && (performance.now() - newBoostStartTime >= SUSTAINED_PRESS_THRESHOLD)
            ) {
                newBoostActive = true;
                // for sustained boost, no short timeout needed here.
                // it will deactivate on keyUp or boundary collision
            }

            // Determine the base speed, applying boost if newBoostActive
            // if the boost is active the current speed will be multiplied by the BOOST_MULTIPLIER constant
            const currentSpeed = DUCK_SPEED * (newBoostActive ? BOOST_MULTIPLIER : 1);


            // Gradually reduce boost speed if active 
            if (newBoostActive && !keysPressed.has('ArrowLeft') && !keysPressed.has('ArrowRight')) {
                // if the boost is active and no arrow key is pressed, reduce the speed gradually
                // this is to prevent the duck from moving too fast when the boost is active
                newVelocityX *= 0.98; // reduce horizontal speed gradually
                newVelocityY *= 0.98; // reduce vertical speed gradually
            }


             // handle spacebar (push flight with incline)
            if (keysPressed.has(' ')) {
                // debugger
                newAnimate = 'flap'; // set animation to flight
                newVelocityY = DUCK_FLAP_VELOCITY_Y; // apply upward push
                newFlapDurationTimer = FLAP_DURATION_FRAMES; // reset flap duration timer
                // adjust horizontal velocity slightly for forward motion
                if (newDirection === 'right') {
                    newVelocityX = DUCK_SPEED;
                    newAngle =    -DUCK_INCLINE_ANGLE; // incline up for right
                } else {
                    // this is for left direction
                    newVelocityX = -DUCK_SPEED;
                    newAngle = DUCK_INCLINE_ANGLE; // incline up for left
                }
            } else {
                // if spacebar is not pressed, apply gravity decrement the flap timer
                newFlapDurationTimer = Math.max(0, newFlapDurationTimer - 1); // decrement flap timer
                // if the flap duration timer is greater than 0, it means the duck is still flapping
                if (newFlapDurationTimer > 0 || newBoostActive) {
                    newAnimate = 'flap'; // still flapping
                    newVelocityY += GRAVITY; // apply gravity effect
                } else {
                    // when the flap duration timer is 0, switch to gliding animation
                    newAnimate = 'glide'; // switch to gliding animation
                    newVelocityY += GRAVITY; // apply gravity effect
                    // Reduce incline when not flapping
                    // this will make the duck angle to gradually return to horizontal
                    if (newAngle > 0) newAngle = Math.max(0, newAngle - GRAVITY / 5);
                    if (newAngle < 0) newAngle = Math.min(0, newAngle + GRAVITY / 5);
                }
                // Apply horizontal movement based on arrow keys and boost
                // speed value is base on the direction of the duck       
                if (keysPressed.has('ArrowLeft')) {
                    newDirection = 'left';
                    newVelocityX = -currentSpeed; // apply leftward speed
                } else if (keysPressed.has('ArrowRight')) {
                    newDirection = 'right';
                    newVelocityX = currentSpeed; // apply rightward speed
                } 
                else if (!newBoostActive) {
                    // Apply deceleration when no arrow keys are pressed
                    // newVelocityX *= DUCK_DECCELERATION; // apply deceleration
                    // if (Math.abs(newVelocityX) < 0.01) {
                    //     newVelocityX = 0; // stop if velocity is very low
                    // }
                    if(newDirection === 'right') {
                        newVelocityX = currentSpeed; // maintain rightward speed
                    }else if(newDirection === 'left') {
                        newVelocityX = -currentSpeed; // maintain leftward speed
                    }
                }
            }

             // ensure velocity Y doesn't go too high 
            newVelocityY = Math.min(newVelocityY, 5); // limit max upward speed
            newVelocityY = Math.max(newVelocityY, -5); // limit max downward speed

            // update position
            let newX = prevDuck.position.x + newVelocityX;
            let newY = prevDuck.position.y + newVelocityY;


            // checking the boundaries of the canvas
            // if the newX is less than 0, it means the duck is hitting the left boundary
            if (newX < 0) {
                newX = 0;
                newVelocityX = 0; // stop if hitting left boundary
                newBoostActive = false; // deactivate boost if hitting boundary
            }
            // if the newX is greater than the width of the canvas minus the duck display size, it means the duck is hitting the right boundary 
            else if (newX + DUCK_DISPLAY_SIZE > WIDTH) {
                newX = WIDTH - DUCK_DISPLAY_SIZE;
                newVelocityX = 0; // stop if hitting right boundary
                newBoostActive = false; // deactivate boost if hitting boundary
            }
            // if the newY is less than 0, it means the duck is hitting the top boundary
            if (newY < 0) {
                newY = 0;
                newVelocityY = 0; // stop if hitting top boundary
            }
            // if the newY is greater than the height of the canvas minus the duck display size, it means the duck is hitting the bottom boundary
            // this will ensure the duck doesn't go out of the canvas 
            else if (newY + DUCK_DISPLAY_SIZE > HEIGHT) {
                newY = HEIGHT - DUCK_DISPLAY_SIZE;
                newVelocityY = 0; // stop if hitting bottom boundary
            }
            // --- Animation Frame Update (Moved into setDuck for consistency) ---
            // update the sprite frame index based on the animation state
            let newSpriteFrameIndex = prevDuck.spriteFrameIndex; 
            const newAnimationTimer = (prevDuck.animationTimer + 1);
            // Only update sprite frame if currently flapping
            if (newAnimate === 'flap') {
                // debugger
                // the Animation_speed constant is used to control the speed of the animation
                // here we have 20 frames per second, so we will update the sprite frame index every 20 frames
                // we do this my checking if the modulo of the animation timer and the animation speed is equal to 0
                // this will ensure that the sprite frame index is updated every 20 frames
                const animationSpeed = newBoostActive ? 15 :ANIMATION_SPEED ;
                if (newAnimationTimer % animationSpeed === 0) {
                    // Increment the sprite frame index
                    newSpriteFrameIndex = (newSpriteFrameIndex + 1) % DUCK_SPRITE_TOTAL_FRAMES;
                }
            } else {
                // When gliding, ensure the frame index is always the first (glide) frame
                if (newDirection === 'right') {
                    newSpriteFrameIndex = DUCK_GLIDE_INDEX_RIGHT; // right glide frame
                }else {
                    newSpriteFrameIndex = DUCK_GLIDE_INDEX_LEFT; // left glide frame
                }
            }

            // return the updated duck state
            return {
                ...prevDuck,
                animate: newAnimate,
                position: { x: newX, y: newY },
                velocityY: newVelocityY,
                velocityX: newVelocityX,
                direction: newDirection,
                currentAngle: newAngle,
                flapDurationTimer: newFlapDurationTimer,
                spriteFrameIndex: newSpriteFrameIndex,
                animationTimer: newAnimationTimer,
                boostActive: newBoostActive,
            };
        })
    }
    return { duck, updateDuck }; // return the duck state and the update function
 }
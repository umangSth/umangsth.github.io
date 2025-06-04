'use client';
import React, { useRef, useEffect, useState } from 'react';


const WIDTH = 1400;
const HEIGHT = 600;

const DUCK_GLIDE_INDEX_LEFT = 2; // index for the left glide frame
const DUCK_GLIDE_INDEX_RIGHT = 1; // index for the right glide frame
const DUCK_FRAME_WIDTH = 30;
const DUCK_FRAME_HEIGHT = 20;
const DUCK_SPRITE_TOTAL_FRAMES = 4;
const DUCK_DISPLAY_SIZE = 60;
const DUCK_SPRITE_SRC = '/game/revise-duck-hunt/duck_flight.png';
const DUCK_SPRITE_SRC_LEFT = '/game/revise-duck-hunt/duck_flight-left.png';
const BACKGROUND_SRC = '/game/revise-duck-hunt/background.jpg';
const DUCK_SPEED = 1;
const DUCK_FLAP_VELOCITY_Y = -0.5; // upward velocity when flapping (spacebar pressed)
const DUCK_INCLINE_ANGLE = Math.PI / 10; //   angle for the upward incline (eg, 18 degrees)
// const DUCK_DECCELERATION = 0.98; // deceleration factor for the duck's horizontal movement
const GRAVITY = 0.005; // To simulate gravity effect on the duck's vertical movement
const FLAP_DURATION_FRAMES = 60 * 2; // 1.5 seconds of flapping at 60 FPS

const ANIMATION_SPEED = 20; // frames per second for the duck animation


// Boost constants
const BOOST_MULTIPLIER = 2.5;
const SUSTAINED_PRESS_THRESHOLD = 1500; // 1.5 seconds sustained press for boost
const DOUBLE_TAP_THRESHOLD = 300; // 300ms for double tap detection
const SHORT_BOOST_DURATION = 500; // 0.5 seconds for short boost

interface Position {
    x: number;
    y: number;
}


interface DuckState {
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


const DuckHuntRevised = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);  // reference to the canvas element using useRef hook
    const animationFrameId = useRef<number | null>(null); // reference to store the animation frame ID for cancellation

    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());  // state to keep track of currently pressed keys its set, i don't know why, but its set
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
    }); // initial state of the duck


    // function to load images asynchronously
    // this function returns a promise resolving to an HTMLImageElement
    // assign src to src attribute image element, onload event resolve the promise with the image element, onerror event reject the promise
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        })
    }

    // useEffect to handle keydown and keyup events for duck movement and boost activation
    // it listens for keydown and keyup events, updates the duck state based on the keys pressed
    useEffect(() => {
        // handle keydown event to update duck state based on arrow keys and spacebar
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeysPressed(prev => new Set(prev).add(event.key)); // add the key to the keysPressed set state
            const now = performance.now(); // get the current time in milliseconds
            const { key } = event; // destructure the key from the event object

            // updating the duck state
            setDuck(prevDuck => {
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
                             setDuck(currentDuck => ({
                                ...currentDuck,
                                boostActive: false,
                                boostStartTime: null,
                             }));
                       }, SHORT_BOOST_DURATION); 

                       // Reset last tap info to prevent triple taps from counting as double 
                          newLastArrowKeyPressed = null;
                          newLastArrowKeyTime = null;
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
        }

        // handles keyup event, meaning when a key is released
        const handleKeyUp = (event: KeyboardEvent) => {
            // removing the key from the Keyspressed set state
            setKeysPressed(prev => {
                const newSet = new Set(prev);
                newSet.delete(event.key)
                return newSet;
            });

            // when an arrow key is released, reset sustained press tracking and deactivate boost
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                setDuck(prevDuck => {
                    // clear any pending boost timeout associated with this key press
                    if (prevDuck.boostTimeoutId){
                        clearTimeout(prevDuck.boostTimeoutId);
                    }

                    // reset duck's boost state
                    return {
                        ...prevDuck,
                        boostStartTime: null, // reset boost start time
                        boostActive: false, // deactivate boost
                        boostTimeoutId: null, // clear boost timeout
                        // keep lastArrowKeyTime and lastArrowKeyPressed for potential immediate re-press
                    }
                });
            }
        }

        // add event listeners for keydown and keyup events in the window objects thus it will listen to the event globally in the window
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp);

        // cleanup function to remove the event listeners from the window object
        // this is to prevent memory leaks and ensure that the event listeners are removed when the component unmounts
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, []); // empty dependency array means this effect hook runs only once at the loading when the component is mounted




    // useEffect to handle the canvas rendering and animation loop
    useEffect(() => {
        // get the current canvas element from the ref hook
        // if the canvas is not available, log an error message and return
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Unavailable to get the current canvas!");
            return;
        }

        // here we are getting the 2D rendering context of the canvas
        // this return an object that provides different methods and properties to draw on the canvas of which this context is of.
        const ctx = canvas?.getContext('2d')
        // if not available, log an error message and return
        if (!ctx) {
            console.error("Unavailable to get the canvas context!")
            return;
        }

        // set the variable to track if the component is mounted, 
        // assign background and duck sprite images to null initially with types null and HTMLImageElement respectively
        // this is to prevent memory leaks and ensure that the animation loop is stopped when the component unmounts
        let isMounted = true;
        let background: HTMLImageElement | null = null;
        let duckSprite: HTMLImageElement | null = null;
        let duckSpriteLeft: HTMLImageElement | null = null;

        // function to load the assets (background and duck sprites) asynchronously
        const loadAssests = async () => {
            try {
                // load the background and duck sprites using the loadImage function
                // we have all these in an array and use promise.all to wait for all the images to load at once
                [background, duckSprite, duckSpriteLeft] = await Promise.all([
                    loadImage(BACKGROUND_SRC),
                    loadImage(DUCK_SPRITE_SRC),
                    loadImage(DUCK_SPRITE_SRC_LEFT)
                ]);

                // check if the component is still mounted before proceeding with the animation
                // this is to prevent memory leaks and ensure that the animation loop is stopped when the component unmounts
                // if not mounted, return early to prevent further execution
                if (!isMounted) return;


                // this is animation loop function 
                const animate = () => {
                    // return early if the component like canvas context & image are not available
                    if (!ctx || !background || !duckSprite || !duckSpriteLeft) return;

                    // Clear the canvas
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // // Draw the background
                    // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                    // update duck state based on input
                    setDuck(prevDuck => {
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

                        // handle spacebar (push flight with incline)
                        if (keysPressed.has(' ')) {
                            // debugger
                            newAnimate = 'flap'; // set animation to flight
                            newVelocityY = DUCK_FLAP_VELOCITY_Y; // apply upward push
                            newFlapDurationTimer = FLAP_DURATION_FRAMES; // reset flap duration timer
                            // adjust horizontal velocity slightly for forward motion
                            if (newDirection === 'right') {
                                newVelocityX = DUCK_SPEED;
                                newAngle = -DUCK_INCLINE_ANGLE; // incline up for right
                            } else {
                                // this is for left direction
                                newVelocityX = -DUCK_SPEED;
                                newAngle = DUCK_INCLINE_ANGLE; // incline up for left
                            }
                        } else {
                            // if spacebar is not pressed, apply gravity decrement the flap timer
                            newFlapDurationTimer = Math.max(0, newFlapDurationTimer - 1); // decrement flap timer
                            // if the flap duration timer is greater than 0, it means the duck is still flapping
                            if (newFlapDurationTimer > 0) {
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
                            // else {
                            //     // Apply deceleration when no arrow keys are pressed
                            //     newVelocityX *= DUCK_DECCELERATION; // apply deceleration
                            //     if (Math.abs(newVelocityX) < 0.01) {
                            //         newVelocityX = 0; // stop if velocity is very low
                            //     }
                            // }
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
                            if (newAnimationTimer % ANIMATION_SPEED === 0) {
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
                        };
                    })


                   // Clear the canvas
                    // and draw the background image
                    ctx.clearRect(0, 0, WIDTH, HEIGHT);
                    ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);



                    // draw the duck with the correct sprite and position
                    const currentDuck = duck.direction === 'right' ? duckSprite : duckSpriteLeft;
                    // draw the duck using the drawDuck function with the updated duck state
                    drawDuck(
                        ctx,
                        currentDuck,
                        duck.position,
                        duck.spriteFrameIndex,
                        duck.currentAngle
                    );
                    // request the next animation frame
                    animationFrameId.current = requestAnimationFrame(animate);
                }
                // start the animation loop
                animate();

            } catch (error) {
                console.error('Error Loading assests:', error)
            }
        }
        // call the loadAssests function to load the assets and start the animation loop
        loadAssests();
        return () => {
            // cleanup function to stop the animation loop and clear the canvas
            // set isMounted to false to prevent further updates
            isMounted = false;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            // clear any pending timeouts when component unmounts
            if (duck.boostTimeoutId) {
                clearTimeout(duck.boostTimeoutId);
            }
        }

    }, [duck, keysPressed])



    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-35`}>
            <div id='header' className='flex flex-col justify-start mb-4'
                style={{ width: WIDTH }}
            >
                <p className="font-bold text-lg text-gray-700 underline mb-4">
                    Note: Not Yet Supported for mobile view.
                </p>

                <div>
                    <h2 className="font-bold text-3xl text-gray-700  mb-1">
                        Revised Duck hunt
                    </h2>
                    <span className="text-xl">(with WebAssembly & native Typescript)</span>
                </div>
            </div>
        
        {/* the main canvas where all the things will happen */}
            <canvas
                ref={canvasRef}
                width={WIDTH}
                height= {HEIGHT}
                style={{
                    border: '1px solid black'
                }}
            />

        </div>
    )

}

export default DuckHuntRevised;


// Function to draw the duck on the canvas
// it takes the canvas context, sprite image, position, frame index, and angle as parameters
const drawDuck = (
    ctx: CanvasRenderingContext2D,
    sprite: HTMLImageElement,
    position: Position,
    frameIndex: number,
    angle: number = 0,
    // direction: 'left' | 'right',
) => {
    ctx.save(); // save the current state of the canvas 


    // Translate to the center of the duck for rotation
    const centerX = position.x + DUCK_DISPLAY_SIZE / 2;
    const centerY = position.y + DUCK_DISPLAY_SIZE / 2;

    ctx.translate(centerX, centerY); // move origin to duck's center
    ctx.rotate(angle)
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
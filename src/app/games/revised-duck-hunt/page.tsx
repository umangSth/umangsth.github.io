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
    position: Position;
    velocityY: number;
    velocityX: number;
    direction: 'left' | 'right';
    spriteFrameIndex: number;
    animationTimer: number;
    currentAngle: number;
    animate: 'flap' | 'glide' | 'shot'
    flapDurationTimer: number;

    boostActive: boolean; // whether boost is currently active
    boostStartTime: number | null; // time when boost started
    lastArrowKeyTime: number | null; // last time an arrow key was pressed
    lastArrowKeyPressed: 'ArrowLeft' | 'ArrowRight' | null; // last arrow key pressed
    boostTimeoutId: ReturnType<typeof setTimeout> | null; // timeout ID for boost duration
}


const DuckHuntRevised = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
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
    })

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        })
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeysPressed(prev => new Set(prev).add(event.key));
            const now = performance.now();
            const { key } = event;

            setDuck(prevDuck => {
                let newBoostActive = prevDuck.boostActive;
                let newBoostStartTime = prevDuck.boostStartTime;
                let newLastArrowKeyTime = prevDuck.lastArrowKeyTime;
                let newLastArrowKeyPressed = prevDuck.lastArrowKeyPressed;
                let newBoostTimeoutId = prevDuck.boostTimeoutId;

                // clear any existing boost timeout if a new key interaction starts
                if (newBoostTimeoutId){
                    clearTimeout(newBoostTimeoutId);
                    newBoostTimeoutId = null;
                }

                if (key === 'ArrowLeft' || key === 'ArrowRight') {
                    // Double-tap detection 
                    if (newLastArrowKeyPressed === key && newLastArrowKeyTime !== null && (now - newLastArrowKeyTime < DOUBLE_TAP_THRESHOLD)) {
                       // Double-tap detected!
                       newBoostActive = true;
                       // set a timeout for the short burst
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

        const handleKeyUp = (event: KeyboardEvent) => {
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
        window.addEventListener("keydown", handleKeyDown)
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])




    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Unavailable to get the current canvas!");
            return;
        }

        const ctx = canvas?.getContext('2d')
        if (!ctx) {
            console.error("Unavailable to get the canvas context!")
            return;
        }

        let isMounted = true;
        let background: HTMLImageElement | null = null;
        let duckSprite: HTMLImageElement | null = null;
        let duckSpriteLeft: HTMLImageElement | null = null;

        const loadAssests = async () => {
            try {
                [background, duckSprite, duckSpriteLeft] = await Promise.all([
                    loadImage(BACKGROUND_SRC),
                    loadImage(DUCK_SPRITE_SRC),
                    loadImage(DUCK_SPRITE_SRC_LEFT)
                ]);


                if (!isMounted) return;



                const animate = () => {
                    if (!ctx || !background || !duckSprite || !duckSpriteLeft) return;

                    // Clear the canvas
                    // ctx.clearRect(0, 0, canvas.width, canvas.height);
                    // // Draw the background
                    // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                    // update duck state based on input
                    setDuck(prevDuck => {
                        let newVelocityX = prevDuck.velocityX
                        let newVelocityY = prevDuck.velocityY;
                        let newDirection = prevDuck.direction;
                        let newAngle = prevDuck.currentAngle; // start with previous angle
                        let newAnimate = prevDuck.animate;
                        let newFlapDurationTimer = prevDuck.flapDurationTimer;

                        let newBoostActive = prevDuck.boostActive;
                        const newBoostStartTime = prevDuck.boostStartTime;
                        // let newBoostTimeoutId = prevDuck.boostTimeoutId; // keep existing timeout if any


                        // -- check for sustained press boost activation ---
                        // only activate sustained boost if an arrow key is currently held down
                        if (!newBoostActive && newBoostStartTime !== null && (keysPressed.has('ArrowLeft') || keysPressed.has('ArrowRight'))
                            && (performance.now() - newBoostStartTime >= SUSTAINED_PRESS_THRESHOLD)
                        ) {
                            newBoostActive = true;
                            // for sustained boost, no short timeout needed here.
                            // it will deactivate on keyUp or boundary collision
                        }

                        // Determine the base speed, applying boost if active
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
                                newVelocityX = -DUCK_SPEED;
                                newAngle = DUCK_INCLINE_ANGLE; // incline up for left
                            }
                        } else {
                            // if spacebar is not pressed, apply gravity decrement the flap timer
                            newFlapDurationTimer = Math.max(0, newFlapDurationTimer - 1); // decrement flap timer
                            if (newFlapDurationTimer > 0) {
                                newAnimate = 'flap'; // still flapping
                                newVelocityY != GRAVITY; // apply gravity effect
                            } else {
                                newAnimate = 'glide'; // switch to gliding animation
                                newVelocityY += GRAVITY; // apply gravity effect
                                // Reduce incline when not flapping
                                if (newAngle > 0) newAngle = Math.max(0, newAngle - GRAVITY / 5);
                                if (newAngle < 0) newAngle = Math.min(0, newAngle + GRAVITY / 5);
                            }
                            // Apply horizontal movement based on arrow keys and boost
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

                        // boundary checks 
                        if (newX < 0) {
                            newX = 0;
                            newVelocityX = 0; // stop if hitting left boundary
                            newBoostActive = false; // deactivate boost if hitting boundary
                        } else if (newX + DUCK_DISPLAY_SIZE > WIDTH) {
                            newX = WIDTH - DUCK_DISPLAY_SIZE;
                            newVelocityX = 0; // stop if hitting right boundary
                            newBoostActive = false; // deactivate boost if hitting boundary
                        }
                        if (newY < 0) {
                            newY = 0;
                            newVelocityY = 0; // stop if hitting top boundary
                        } else if (newY + DUCK_DISPLAY_SIZE > HEIGHT) {
                            newY = HEIGHT - DUCK_DISPLAY_SIZE;
                            newVelocityY = 0; // stop if hitting bottom boundary
                        }


                        // --- Animation Frame Update (Moved into setDuck for consistency) ---
                        let newSpriteFrameIndex = prevDuck.spriteFrameIndex;
                        const newAnimationTimer = (prevDuck.animationTimer + 1);

                        // Only update sprite frame if currently flapping
                        if (newAnimate === 'flap') {
                            if (newAnimationTimer % ANIMATION_SPEED === 0) {
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


                    // drawing logic
                    ctx.clearRect(0, 0, WIDTH, HEIGHT);
                    ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);



                    // draw the duck with the correct sprite and position
                    const currentDuck = duck.direction === 'right' ? duckSprite : duckSpriteLeft;
                    drawDuck(
                        ctx,
                        currentDuck,
                        duck.position,
                        duck.spriteFrameIndex,
                        duck.currentAngle
                    );

                    animationFrameId.current = requestAnimationFrame(animate);
                }
                animate();

            } catch (error) {
                console.error('Error Loading assests:', error)
            }
        }

        loadAssests();
        return () => {
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

    const sx = frameIndex * DUCK_FRAME_WIDTH;


    ctx.drawImage(
        sprite,
        sx, 0, // source coordinates
        DUCK_FRAME_WIDTH, DUCK_FRAME_HEIGHT, // source dimensions
        position.x, position.y, // destination coordinates
        DUCK_DISPLAY_SIZE, DUCK_DISPLAY_SIZE // destination dimensions
    );

    ctx.restore(); // restore the canvas state to before the translation and rotation

}
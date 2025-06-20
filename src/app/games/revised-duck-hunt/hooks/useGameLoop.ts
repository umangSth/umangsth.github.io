import { useEffect, useState, useRef } from "react";
import { loadImage, drawDuck } from "../utils/helpers";
import { BACKGROUND_SRC, DUCK_SPRITE_SRC, DUCK_SPRITE_SRC_LEFT, WIDTH, HEIGHT } from "../utils/constants";
import { DuckState } from "../utils/types";

interface UseGameLoopProps {
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
    duckState: DuckState;
    updateDuck: () => void;
}

export const useGameLoop = ({ canvasRef, duckState, updateDuck }: UseGameLoopProps) => {
    const animationFrameId = useRef<number | null>(null); // reference to store the animation frame ID for cancellation
    const [assetsLoaded, setAssetsLoaded] = useState(false);

    useEffect(()=> {
        // assign the canvas context to a variable
        const canvas = canvasRef?.current;
        if (!canvas) {
            console.error("Canvas reference is not set.");
            return;
        }
        // get the canvas 2d context
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Failed to get canvas context.");
            return;
        }
        
        // variable for loading images
        let isMounted = true;
        let backgroundImage: HTMLImageElement | null = null;
        let duckSprite: HTMLImageElement | null = null;
        let duckSpriteLeft: HTMLImageElement | null = null;

        const loadAssetsAndStartLoop = async () => {
            try {   
                 // load the background and duck sprites using the loadImage function
                // we have all these in an array and use promise.all to wait for all the images to load at once
                [backgroundImage, duckSprite, duckSpriteLeft] = await Promise.all([
                    loadImage(BACKGROUND_SRC),
                    loadImage(DUCK_SPRITE_SRC),
                    loadImage(DUCK_SPRITE_SRC_LEFT)
                ]);

                // check if the component is still mounted before proceeding with the animation
                // this is to prevent memory leaks and ensure that the animation loop is stopped when the component unmounts
                // if not mounted, return early to prevent further execution
                if (!isMounted) return;
                setAssetsLoaded(true); // set assets loaded to true
                animate(); // start the animation loop
            } catch (error){
                console.error("Error loading assets:", error);
            }
        };

        const animate = () => {
            if (!ctx || !backgroundImage || !duckSprite || !duckSpriteLeft) {
                console.error("Canvas context or images not loaded.");
                return;
            }

            updateDuck(); // update the duck state

            // drawing operations
            ctx.clearRect(0, 0, WIDTH, HEIGHT); // clear the canvas
            ctx.drawImage(backgroundImage, 0, 0, WIDTH, HEIGHT); // draw the background

            const currentDuck = duckState.direction === 'left' ? duckSpriteLeft : duckSprite;
            drawDuck(
                ctx,
                currentDuck,
                duckState.position,
                duckState.spriteFrameIndex,
                duckState.currentAngle,
                duckState.direction
            ); // draw the duck
            animationFrameId.current = requestAnimationFrame(animate); // request the next frame
        };

        loadAssetsAndStartLoop(); // start loading assets and then the loop

        return () => {
            isMounted = false; // set isMounted to false to prevent memory leaks
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current); // cancel the animation frame if it exists
            }
        };
    }, [updateDuck, duckState]);

    return { assetsLoaded };
}
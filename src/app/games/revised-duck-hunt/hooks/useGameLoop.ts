import { useEffect, useState, useRef } from "react";
import { loadImage, drawDuck } from "../utils/helpers";
import { BACKGROUND_SRC, DUCK_SPRITE_SRC, DUCK_SPRITE_SRC_LEFT,DUCK_SPRITE_STANDING_SRC, DUCK_SPRITE_STANDING_SRC_LEFT, WIDTH, HEIGHT, CLOUD_SKY_SRC, MOUNTAINS_SRC, GREEN_HILLS_1_SRC, GREEN_FIELD_SRC } from "../utils/constants";
import { DuckState } from "../utils/types";

interface UseGameLoopProps {
    canvasRef?: React.RefObject<HTMLCanvasElement | null>;
    duckState: DuckState;
    updateDuck: () => void;
}

interface BackgroundLayer {
    image: HTMLImageElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    x: number; // Initial x-position, often 0
    y: number; // Initial y-position
    scrollFactor: number; // How fast this layer scrolls relative to the camera
    lastCameraX?: number; // Optional last camera X position for parallax calculations
    needsRedraw?: boolean; // Optional flag to indicate if the layer needs to be redrawn
}

export const useGameLoop = ({ canvasRef, duckState, updateDuck }: UseGameLoopProps) => {
    const animationFrameId = useRef<number | null>(null); // reference to store the animation frame ID for cancellation
    const [assetsLoaded, setAssetsLoaded] = useState(false);
    // this will hold the background layers
    const backgroundLayers = useRef<BackgroundLayer[]>([]); // reference to store background layers
    const lastCameraX = useRef<number>(0); // reference to store the last camera X position

    // performance optimization: skip frames when duck isn't moving much
    const lastDuckPosition = useRef({ x: 0, y: 0 });
    const frameSkipCounter = useRef(0);
    const FRAME_SKIP_THRESHOLD = 5; // Skip frames if the duck hasn't moved significantly

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
        let duckSprite: HTMLImageElement | null = null;
        let duckSpriteLeft: HTMLImageElement | null = null;
        let duckSpriteStanding: HTMLImageElement | null = null;
        let duckSpriteStandingLeft: HTMLImageElement | null = null;

        // background images 
        let cloudSkyImage: HTMLImageElement | null = null;
        let mountainsImage: HTMLImageElement | null = null;
        let greenHills1Image: HTMLImageElement | null = null;
        let greenHills2Image: HTMLImageElement | null = null;
        let greenFieldImage: HTMLImageElement | null = null;

        const loadAssetsAndStartLoop = async () => {
            try { 
                // load the background and duck sprites using the loadImage function
                // we have all these in an array and use promise.all to wait for all the images to load at once
                [duckSprite, 
                    duckSpriteLeft, duckSpriteStanding, 
                    duckSpriteStandingLeft] = await Promise.all([
                        loadImage(DUCK_SPRITE_SRC),
                        loadImage(DUCK_SPRITE_SRC_LEFT),
                        loadImage(DUCK_SPRITE_STANDING_SRC), // load the standing sprite for the duck
                        loadImage(DUCK_SPRITE_STANDING_SRC_LEFT), // load the standing sprite for the duck facing left
                    ]);

                // check if the component is still mounted before proceeding with the animation
                // this is to prevent memory leaks and ensure that the animation loop is stopped when the component unmounts
                // if not mounted, return early to prevent further execution
                if (!isMounted) return;



                // load background images
                const [cloudSkyImage, mountainsImage, greenHills1Image, greenFieldImage] = await Promise.all([
                    loadImage(CLOUD_SKY_SRC),
                    loadImage(MOUNTAINS_SRC),
                    loadImage(GREEN_HILLS_1_SRC), // Uncomment this if you want to use the green hills layer
                    loadImage(GREEN_FIELD_SRC),
                ]);

                if (!isMounted) return; // check again after loading images

                // create optimized background layers with pre-rendered canvases
                const createLayer = (image: HTMLImageElement, scrollFactor: number): BackgroundLayer => {
                    const layerCanvas = document.createElement('canvas');
                    const layerCtx = layerCanvas.getContext('2d')!;

                    // make the canvas wider to reduce the redraw frequency
                    const bufferWidth = image.width * 3; // 3 times the image width
                    layerCanvas.width = bufferWidth;
                    layerCanvas.height = HEIGHT; // match the main canvas height

                    return {
                        image, 
                        canvas: layerCanvas,
                        ctx: layerCtx,
                        x: 0,
                        y: 0,
                        scrollFactor,
                        lastCameraX: -Infinity,
                        needsRedraw: true,
                    }
                }


                const loadedLayers: BackgroundLayer[] = [];
                if (cloudSkyImage) loadedLayers.push(createLayer(cloudSkyImage, 0.1));
                if (mountainsImage) loadedLayers.push(createLayer(mountainsImage, 0.2));
                if (greenHills1Image) loadedLayers.push(createLayer(greenHills1Image, 0.3));
                if (greenFieldImage) loadedLayers.push(createLayer(greenFieldImage, 0.5));

                backgroundLayers.current = loadedLayers; // assign the loaded layers to the backgroundLayers reference

                setAssetsLoaded(true); // set assets loaded to true
                animate(); // start the animation loop
            } catch (error){
                console.error("Error loading assets:", error);
            }
        };


        const renderBackgroundLayer = (layer: BackgroundLayer, cameraX: number) => {
            const layerScrollX = -cameraX * layer.scrollFactor;

            // check if we need to redraw this layer
            const scrollDifference = Math.abs(layerScrollX - (layer.lastCameraX || 0));
            const redrawThreshold = layer.image.width * 0.1;

            if (scrollDifference < redrawThreshold && !layer.needsRedraw) {
                return; // skip redraw if the scroll difference is small and no forced redraw
            }


            layer.lastCameraX = layerScrollX;
            layer.needsRedraw = false; // reset the redraw flag

            layer.ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height); // clear the layer canvas
            const startX = layerScrollX % layer.image.width;
            const adjustedStartX = startX > 0 ? startX - layer.image.width : startX;

            // draw repeating background on the layer canvas
            for (let x = adjustedStartX; x < layer.canvas.width; x += layer.image.width) {
                layer.ctx.drawImage(layer.image, x, layer.y, layer.image.width, HEIGHT);
            }
        }







        const animate = () => {
            // Ensure all critical assets are loaded before drawing
            if (!ctx || !duckSprite || !duckSpriteLeft || !duckSpriteStanding || !duckSpriteStandingLeft) {
                console.error("Canvas context or essential duck sprites not loaded.");
                return;
            }

           // determine the 'camera' X position based on the duck's position
            // for simplicity, we will center the camera on the duck
            const cameraX = duckState.position.x - WIDTH / 2;


            const cameraMoved = Math.abs(cameraX - lastCameraX.current) > 1; // consider camera moved if more than 1px change
            const duckMoved = Math.abs(duckState.position.x - lastDuckPosition.current.x) > 0.5 ||
                                Math.abs(duckState.position.y - lastDuckPosition.current.y) > 0.5;


            // skip frame if nothing significant changed
            if(!cameraMoved && !duckMoved && frameSkipCounter.current < FRAME_SKIP_THRESHOLD) {
                frameSkipCounter.current++;
                animationFrameId.current = requestAnimationFrame(animate);
                return;
            }


            frameSkipCounter.current = 0; // reset the skip counter if we are rendering            updateDuck(); // update the duck state
            updateDuck(); // update the duck state
            // drawing operations
            ctx.clearRect(0, 0, WIDTH, HEIGHT); // clear the canvas


            // render background layers (with smart caching)
            if (cameraMoved) {
                backgroundLayers.current.forEach(layer => renderBackgroundLayer(layer, cameraX));
                lastCameraX.current = cameraX; // update last camera position
            }
            
            // draw pre-rendered background layers onto the main canvas
            backgroundLayers.current.forEach(layer => {
                const offsetX = (cameraX * layer.scrollFactor) % layer.image.width;
                ctx.drawImage(layer.canvas, -offsetX, 0);
            })



            // Determine which duck sprite to use based on state
            let currentDuckSprite = duckState.direction === 'left' ? duckSpriteLeft : duckSprite;
            if (duckState.animate === 'standing') {
                currentDuckSprite = duckState.direction === 'left' ? duckSpriteStandingLeft : duckSpriteStanding;
            }

            // --- IMPORTANT CHANGE HERE: Adjust duck's X position for drawing on canvas ---
            drawDuck(
                ctx,
                currentDuckSprite, // Use the determined sprite
                { x: duckState.position.x - cameraX, y: duckState.position.y }, // Pass adjusted position
                duckState.spriteFrameIndex,
                duckState.currentAngle,
                duckState.direction
            ); // draw the duck

            // update last duck position
            lastDuckPosition.current = { x: duckState.position.x, y: duckState.position.y };


            animationFrameId.current = requestAnimationFrame(animate); // request the next frame
        };

        loadAssetsAndStartLoop(); // start loading assets and then the loop

        return () => {
            isMounted = false; // set isMounted to false to prevent memory leaks
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current); // cancel the animation frame if it exists
            }

            // cleanup background layers
            backgroundLayers.current.forEach(layer => {
                layer.canvas.width = 0;
                layer.canvas.height = 0;
            });
        };
    }, [updateDuck, duckState, canvasRef]); // Added canvasRef to dependencies to ensure effect re-runs if canvas changes
    // Note: If updateDuck is not wrapped in useCallback in the parent, it will cause this effect to re-run
    // on every render of the parent, potentially re-loading assets. Consider wrapping updateDuck in useCallback.

    return { assetsLoaded };
}

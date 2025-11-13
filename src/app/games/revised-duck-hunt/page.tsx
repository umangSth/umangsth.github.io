'use client';
import React, { useRef, useEffect, useState } from 'react';
import { 
    WIDTH, 
    HEIGHT, 
} from './utils/constants'; // import the constants for the game
import { useInput } from './hooks/useInput'; // custom hook to handle input
import { useDuckLogic } from './hooks/useDuckLogic'; // custom hook to handle duck logic
import { useGameLoop } from './hooks/useGameLoop'; // custom hook to handle the game loop


const DuckHuntRevised = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);  // reference to the canvas element using useRef hook
    
    const keysPressed = useInput(); // custom hook to handle input, it returns a Set of keys pressed

    const { duck:duckState, updateDuck } = useDuckLogic(keysPressed); // custom hook to handle duck logic, it returns the duck state and a function to update the duck state
    
    // run the game loop using the useGameLoop custom hook
    const { assetsLoaded } = useGameLoop({
        canvasRef, // pass the canvas reference to the game loop
        duckState, // pass the duck state to the game loop
        updateDuck // pass the function to update the duck state to the game loop
    });


// console.log("Duck State:", duck); // for debugging purposes, you can remove this later
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
                    {/* <span className="text-xl">(with WebAssembly & native Typescript)</span> */}
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
            {/* display a message when assets are loading */}
            {!assetsLoaded && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <p className="text-xl font-bold text-gray-700">Loading...</p>
                </div>
            )}

        </div>
    )

}

export default DuckHuntRevised;
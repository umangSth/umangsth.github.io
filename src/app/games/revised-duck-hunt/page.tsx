'use client';
import React, { useRef, useEffect } from 'react';
import { 
    WIDTH, 
    HEIGHT, 
    DUCK_FRAME_WIDTH
} from './utils/constants'; // import the constants for the game
import init, { set_canvas_dimensions, set_user_input } from '../hello-wasm/pkg/hello_wasm';
import { loadAllAssets } from './utils/gameLoop';
import { gameLoop } from './utils/gameLoop';

export const BUFFER_WIDTH = 150;

const DuckHuntRevised = () => {
    const canvas_ref = useRef(null);
    const isRunning = useRef(true);
    // initialize the wasm 
    useEffect(()=>{
        isRunning.current = true;
       const start = async ()=>{
            await init();
            set_canvas_dimensions(WIDTH - BUFFER_WIDTH, HEIGHT);

            await loadAllAssets();
            if(canvas_ref.current){
            const canvas:HTMLCanvasElement = canvas_ref.current;
            if(canvas){
                const ctx = canvas.getContext('2d');
                if(ctx) {
                    gameLoop(ctx, isRunning);
                }
            }
        }  
       }
       start();
       // CleanUp: this runs when the component disappears
       return () => {
        isRunning.current = false;
       }
    },[]);


 


    // Input handler 
    useEffect(()=> {
        const handleInput = (e:KeyboardEvent) => {
           switch (e.code){
            case 'ArrowLeft':
            case 'KeyA':
                set_user_input(1);
                break;
            case 'ArrowRight':
            case 'KeyD':
                set_user_input(2);
                break;
            case 'Space':
                e.preventDefault();
                break;
           }
        };

        window.addEventListener('keydown', handleInput);
        return ()=>{
            window.removeEventListener('keydown', handleInput)
        }
    }, [])




    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-15`}>
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
                </div>
            </div>
        
        {/* the main canvas where all the things will happen */}
            <canvas
                ref={canvas_ref}
                width={WIDTH}
                height={HEIGHT}
                style={{
                    border: '3px solid black',
                    margin: '0 auto',
                    display: 'block',
                }}
            />
        </div>
    )

}

export default DuckHuntRevised;


// Next.js page 
'use client'

import init, {MazeState } from './hello-wasm/pkg/hello_wasm'
import { useEffect, useRef, useState } from "react";



export default function Games() {
const [mazeLoaded, setMazeLoaded] = useState(false);
const mazeStateRef = useRef<MazeState | null>(null);
useEffect(()=>{
  const initializeWasm = async () =>  {
    await init();
    const mazeInstance = await loadAndDrawMaze();
    mazeStateRef.current = mazeInstance;
  }
  initializeWasm();
}, []);


const loadAndDrawMaze = async () => {
  try {
    const response = await fetch("/game/maze_1.txt");
    if (!response.ok)  throw new Error("Failed to fetch maze data");
    const mazeData = await response.text();
     
    const mazeState = await MazeState.new("demoCanvas", mazeData);
    setMazeLoaded(true);
    return mazeState;
  } catch (error) {
    console.error("Failed to load maze data:", error);
    return null;
  }
}

const startSearch = async () => {
  if(mazeStateRef.current){
    const result = await mazeStateRef.current.find_path_with_bfs(10)
                  .then((value) => console.log("Path finding complete!", value))
                  .catch(err => console.error("Error:", err));;
    console.log(result);
  }else{
      console.log("maze not loaded");
  }
}
  
  return (
      
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <p className="font-bold text-lg underline">Note: Not Yet Supported for the mobile view.</p>
         <div className="mt-4">
         {!mazeLoaded && <div className="loading">Loading maze...</div>}
           <canvas id="demoCanvas" width="1200" height="600" className="border-2 border-black bg-gray-400"></canvas>
           <div className="flex gap-2 m-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                  onClick={startSearch}
                >
                    Start the search
                </button>
            </div>
            
         </div>
      </div>
    );
  }
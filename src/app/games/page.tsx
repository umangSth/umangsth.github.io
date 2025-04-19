// Next.js page 
'use client'
import Image from "next/image";
import imageLoader from "../resume/helper_function/helper_function";
import init, {reverse, draw_circle, draw_rect, clear_canvas } from './hello-wasm/pkg/hello_wasm'
import { useEffect, useState } from "react";



export default function Games() {
const [inputValue, setInputValue] = useState("");
const [result, setResult] = useState("");
useEffect(()=>{
  const initializeWasm = async () =>  {
    await init();
  }
  initializeWasm();
}, []);

const handleDrawCircle = () => {
  draw_circle("demoCanvas", 100, 100, 50, "red");
}

const handleDrawRect = () => {
  draw_rect("demoCanvas", 100, 100, 100, 100, "blue");
}

const handleClearCanvas = () => {
  clear_canvas("demoCanvas");
}

const handleReverse  = () => {
  setResult(reverse(inputValue));
}

  
  return (
      
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">My Games</h1>
          <div className="relative w-96 h-64 mb-8">
            <Image
              src={imageLoader("/images/miscellaneous/under-construction.jpg")}
              alt="Coming Soon"
              layout="fill"
              objectFit="contain"
            />

          </div>
          <p className="text-lg text-gray-600 mb-4">
            This section is currently under construction. Please check back later!
          </p>
          <p className="text-sm text-gray-500">
            I am working hard to bring you some awesome games, mostly simple ones.
          </p>
         <div className="mt-4">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-2 mr-2"
            placeholder="Enter a string to reverse"
          />
          <button
            onClick={handleReverse}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reverse
          </button>
          {
            result && (
              <p className="text-gray-600 mt-2">
                {result}
              </p>
            )
          }
         </div>



         <div className="mt-4">
           <canvas id="demoCanvas" width="300" height="300" className="border-2 border-black"></canvas>
           <div className="flex gap-2 mb-4">
              <button
                onClick={handleDrawCircle}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Draw Circle
              </button>
              
              <button
                onClick={handleDrawRect}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Draw Rectangle
              </button>
              
              <button
                onClick={handleClearCanvas}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Clear
              </button>
            </div>
         </div>
      </div>
    );
  }
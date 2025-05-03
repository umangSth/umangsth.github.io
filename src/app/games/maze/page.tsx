// Next.js page
'use client';

import { ts_implementation } from '../algorithms/find-path';
import { from_string_to_game_state, MazeInfo, string_to_maze_grid } from '../algorithms/helper/helper_function';
// import init, { MazeState } from '../hello-wasm/pkg/hello_wasm';
import init, * as wasm from '../hello-wasm/pkg/hello_wasm';
import React, { useEffect, useRef, useState } from 'react';

const MAZE_BLOCK_SIZE = 8.0;
const MAZE_WIDTH = 120 * MAZE_BLOCK_SIZE;
const MAZE_HEIGHT = 60 * MAZE_BLOCK_SIZE;


export default function Games() {
  const [mazeLoaded, setMazeLoaded] = useState(false);
  const mazeStateRef = useRef<wasm.MazeState | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timeTakenTS, setTimeTakenTS] = useState(0);
  const [delay, setDelay] = useState(0);
  const [mainBtnState, setMainBtnState] = useState<'start' | 'reset' | 'loading'>('start');
  const [algorithm, setAlgorithm] = useState('BFS');
  const [useWasm, setUseWasm] = useState(true);
  const [gameState, setGameState] = useState<MazeInfo | null>(null);
  const [mazeGrid, setMazeGrid] = useState<string[][]>([]);    
  const [searching, setSearching] = useState(false);
    
  useEffect(() => {
    const initializeWasm = async () => {
      await init();
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          // wasm loading
          const mazeInstance = await loadAndDrawMaze();
          mazeStateRef.current = mazeInstance;
          setMazeLoaded(true);
        }
      }
    };
    initializeWasm();
  }, []);


  const Ts_implementation = useRef<ts_implementation | null>(null);


  // TypeScript side
  useEffect(() => {
    if (gameState && canvasRef.current) {
      const target = gameState.target;
      const computer_player = gameState.computer_player;
      Ts_implementation.current = new ts_implementation({
        maze_grid: mazeGrid,
        canvas: canvasRef.current,
        start: computer_player,
        target: target,
      });


    }

  }, [mazeGrid, gameState, canvasRef])




  // wasm loading and drawing of the maze
  const loadAndDrawMaze = async () => {
    try {
      const response = await fetch('/game/maze_1.txt');
      if (!response.ok) throw new Error('Failed to fetch maze data');
      const mazeData = await response.text();
      setMazeGrid(string_to_maze_grid(mazeData));  // for the TypeScript side
      const mazeState = await wasm.MazeState.new('demoCanvas', mazeData, 8.0);
      console.log('maze state', mazeState);
      setMazeLoaded(true);
      if (!gameState) {
        const mazeInfo = await mazeState.get_maze_info();
        setGameState(from_string_to_game_state(mazeInfo));
      }
      return mazeState;
    } catch (error) {
      console.error('Failed to load maze data:', error);
      return null;
    }
  };

  
  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
     const canvas = canvasRef.current;
     if (canvas && mazeStateRef.current && gameState && !searching) {
      console.log('canvas clicked');
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const gridX = Math.floor(x / MAZE_BLOCK_SIZE);
        const gridY = Math.floor(y / MAZE_BLOCK_SIZE);


        if (gridY >= 0 && gridY < mazeGrid.length && gridX >= 0 && gridX < mazeGrid[0].length) {

          mazeStateRef.current.set_target(gridX, gridY);
          const mazeInfo = await mazeStateRef.current.get_maze_info();
          setGameState(from_string_to_game_state(mazeInfo));
          setMainBtnState('start');
     }
    }
  }

  const startSearch = async () => {
    if (mainBtnState === 'reset' && mazeStateRef.current) {
      await mazeStateRef.current.reset();
      setMainBtnState('start');
      setTimeTaken(0);
      setTimeTakenTS(0);
      return;
    }
    const startTime = performance.now();
    setSearching(true);
    if (mazeStateRef.current && useWasm) {
      setMainBtnState('loading');
      await mazeStateRef.current
        .find_path(algorithm, delay)
        .then((value) => {
          if (value.includes('Path found!')) {
            setMainBtnState('reset');
            console.log('Path finding complete!', value)
            setSearching(false);
            setTimeTaken(performance.now() - startTime);
          }
        })
        .catch((err) => console.error('Error:', err));
    } else if (Ts_implementation.current && !useWasm) {
      await Ts_implementation.current.find_path(delay, algorithm).then((value) => {
        if (value) {
          setMainBtnState('reset');
          console.log('Path finding complete!', value)
          setSearching(false);
          setTimeTakenTS(performance.now() - startTime);
        }
      });
    } else if (mainBtnState === 'reset') {
      setMainBtnState('start');

    } else {
      console.log('maze not loaded or in loading state');
    }
  };


  const clearVisualization = async () => {
    if (mazeStateRef.current) {
      await mazeStateRef.current.clear_visualization();
      setMainBtnState('start');
    }
  };

  const toggleImplementation = () => {
    setUseWasm(!useWasm);
    setMainBtnState('start');
    clearVisualization();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-35">
      <p className="font-bold text-lg text-gray-700 underline mb-4">
        Note: Not Yet Supported for mobile view.
      </p>
      <div className="bg-white rounded-md p-6">
        {!mazeLoaded && (
          <div className="text-center text-gray-600 animate-pulse">
            Loading maze...
          </div>
        )}
        <div id='header' className='flex flex-row justify-between items-center mb-4'>
          <div>
            <h2 className="font-bold text-3xl text-gray-700  mb-1">
              Maze Solver 
            </h2>
            <span className="text-xl">(with WebAssembly & native Typescript)</span>
          </div>
          
          <div className="flex flex-row gap-2 justify-items-center items-center" >
          <div className="flex items-center space-x-3 bg-gray-100 px-3 py-2 rounded-lg mt-3">
            <span className="text-sm font-medium text-gray-700">
              {useWasm ? 'WebAssembly' : 'TypeScript'}
            </span>
            <button
              onClick={toggleImplementation}
              className={`z-9999 relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${useWasm ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              role="switch"
              aria-checked={useWasm}
            >
              <span className="sr-only">Use WASM implementation</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useWasm ? 'translate-x-6' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
          </div>
        </div>
        <canvas
          id="demoCanvas"
          ref={canvasRef}
          width={MAZE_WIDTH}
          height={MAZE_HEIGHT}
          onClick={handleCanvasClick}
          className="border-2 border-gray-400 rounded-md"
        ></canvas>
        <div className="flex gap-4 mt-4 w-full justify-between flex-row">
          <div className="flex items-center flex-row gap-4">
            <button
              className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  cursor-pointer"
              onClick={startSearch}
              disabled={!mazeLoaded || mainBtnState === 'loading'}
            >
              {mainBtnState === 'start' ? "Start the search" : mainBtnState === 'loading' ? "Searching..." : "Reset"}
            </button>
            {
              mainBtnState === 'reset' && <button
                className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  cursor-pointer"
                onClick={clearVisualization}
              >
                Clear Visualization
              </button>
            }

            <div className="relative">
              <select
                className=" cursor-pointer block appearance-none w-full bg-blue-500 border border-blue-500 hover:border-blue-700 text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setDelay(parseInt(e.target.value))
                }>
                <option value="0">Select render delay</option>
                <option value="1"> 1ms delay </option>
                <option value="10"> 5ms delay </option>
                <option value="40"> 10ms delay </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2  text-white">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                className=" cursor-pointer block appearance-none w-full bg-blue-500 border border-blue-500 hover:border-blue-700 text-white py-2 px-4  pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAlgorithm(e.target.value)
                }
              >
                <option value="0">Select Algorithm</option>
                <option value="BFS">Breath First Search</option>
                <option value="DFS">Depth First Search</option>
                <option value="BestFirst">Best First Search</option>
                <option value="AStar">A*</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative flex items-center flex-col">
            <span className="text-gray-700 text-sm lg:text-sm xl:text-lg">Wasm Time: <span className="font-bold">{timeTaken.toFixed(2)} ms</span></span>
            <span className="text-gray-700 text-sm lg:text-sm xl:text-lg">TypeScript Time: <span className="font-bold">{timeTakenTS.toFixed(2)} ms</span></span>
          </div>
        </div>
        <p >Note: Default setting is bfs with zero delay with wasm, set target by clicking on the canvas</p>
      </div>
      <div id='description' className="flex flex-col gap-1 items-left p-6  bg-[var(--secondary1)] rounded-b-2xl shadow-md hover:shadow-neutral-900" style={{ width: `${MAZE_WIDTH + 48}px` }}>
        <h2 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-800">Explanation:</h2>
        <div className="text-sm lg:text-sm xl:text-lg m-6 mb-2 overflow-hidden transition-all duration-500 ease-in-out">
          <div className=" leading-relaxed text-amber-800 font-stretch-75% text-xl mb-10 bg-amber-50 p-4 rounded-2xl flex flex-col gap-4">
            <p> 
                Here you can play with the algorithms and see the difference in performance.
                I have used two implementations for search algorithms, one with TypeScript and another with Rust(Wasm).
                To see the difference in performance there&apos;s a timers at the bottom right corner of the page. As you can see the 
                default setting is bfs with zero delay with wasm. once the search is complete, you can see a button reset the visualization, 
                so you can play with different algorithms and different delays, also the two implementations, 
                TypeScript and Wasm (Rust) in same target see the performance difference.
           </p>
           <p>
                As this app is a learning project and haven&apos;t done any performance optimizations,
                As i was expecting that the WASM would out perform the TypeScript in every case, but it didn&apos;t. I think there is still improvements to be made,
                one primary improvement I stumbled upon, is that when I am coloring the cells, I am calling the context of the canvas,
                which is a operation that i think is expensive, causing this performance issue. I will try to optimize this in the future, with other improvements, with 
                different Test environments.
           </p>
          </div>
         
          <h3 className="text-md lg:text-md xl:text-md font-semibold mt-4 text-gray-800">
            Explore Different Pathfinding Strategies:
          </h3>
          <p className="text-gray-700 leading-relaxed mt-2 ">
            This solver showcases the capabilities of various fundamental
            pathfinding algorithms. Each algorithm employs a unique strategy to
            navigate the maze:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 flex flex-col gap-5">
            <li>
              <span className="text-black-500 font-semibold">Breadth-First Search (BFS):</span> Explores the maze layer by layer,
              guaranteeing the shortest path in unweighted graphs. It systematically checks all neighbors at the present depth prior to moving on to the nodes at the next depth level.
            </li>
            <li>
              <span className="text-black-500 font-semibold">Depth-First Search (DFS):</span> Explores as far as possible along each
              branch before backtracking. While not guaranteed to find the
              shortest path, it can be more memory-efficient for very deep mazes.
            </li>
            <li>
              <span className="text-black-500 font-semibold">Best-First Search:</span> An informed search algorithm that explores
              nodes based on a heuristic function, estimating the cost to the
              goal. Its performance heavily relies on the accuracy of the
              heuristic.
            </li>
            <li>
              <span className="text-black-500 font-semibold">A* Search:</span> A powerful informed search algorithm that combines
              the cost to reach a node and a heuristic estimate of the cost to
              the goal. It is widely used for finding the shortest path efficiently.
            </li>
          </ul>
        </div>
      </div>
    </div>

  );
}

// Next.js page
'use client';

import init, { MazeState } from './hello-wasm/pkg/hello_wasm';
import React, { useEffect, useRef, useState } from 'react';

const MAZE_BLOCK_SIZE = 8.0;
const MAZE_WIDTH = 120 * MAZE_BLOCK_SIZE;
const MAZE_HEIGHT = 60 * MAZE_BLOCK_SIZE;

export default function Games() {
  const [mazeLoaded, setMazeLoaded] = useState(false);
  const mazeStateRef = useRef<MazeState | null>(null);
  const [delay, setDelay] = useState(0);
  const [mainBtnState, setMainBtnState] = useState<'start' | 'reset' | 'loading'>('start');
  const [algorithm, setAlgorithm] = useState('BFS');

  useEffect(() => {
    const initializeWasm = async () => {
      await init();
      const mazeInstance = await loadAndDrawMaze();
      mazeStateRef.current = mazeInstance;
    };
    initializeWasm();
  }, []);

  const loadAndDrawMaze = async () => {
    try {
      const response = await fetch('/game/maze_1.txt');
      if (!response.ok) throw new Error('Failed to fetch maze data');
      const mazeData = await response.text();

      const mazeState = await MazeState.new('demoCanvas', mazeData, 8.0);
      setMazeLoaded(true);
      return mazeState;
    } catch (error) {
      console.error('Failed to load maze data:', error);
      return null;
    }
  };

  const startSearch = async () => {
    if (mazeStateRef.current) {
      setMainBtnState('loading');
      await mazeStateRef.current
        .find_path(algorithm, delay)
        .then((value) => {
          if (value.includes('Path found!')) {
            setMainBtnState('reset');
            console.log('Path finding complete!')
          }
        })
        .catch((err) => console.error('Error:', err));
    } else if (mainBtnState === 'reset') {
      setMainBtnState('start');
     
    }else { 
      console.log('maze not loaded or in loading state');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-30">
      <p className="font-bold text-lg text-gray-700 underline mb-4">
        Note: Not Yet Supported for mobile view.
      </p>
      <div className="bg-white rounded-md p-6">
        {!mazeLoaded && (
          <div className="text-center text-gray-600 animate-pulse">
            Loading maze...
          </div>
        )}
        <canvas
          id="demoCanvas"
          width={MAZE_WIDTH}
          height={MAZE_HEIGHT}
          className="border-2 border-gray-400 rounded-md"
        ></canvas>
        <div className="flex gap-4 mt-4 justify-start">

         <button
            className="bg-green-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  cursor-pointer"
            onClick={startSearch}
            disabled={!mazeLoaded || mainBtnState === 'loading'}
          >
            {mainBtnState === 'start' ? "Start the search" : mainBtnState === 'loading' ? "Searching..." : "Reset"}
          </button>
          
          
          <div className="relative">
            <select
              className=" cursor-pointer block appearance-none w-full bg-blue-500 border border-blue-500 hover:border-blue-700 text-white py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:shadow-outline"             
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setDelay(parseInt(e.target.value))
                }>
                 <option value="0">Select render delay</option>
                 <option value="10"> 10ms delay </option>
                 <option value="40"> 40ms delay </option> 
                 <option value="80"> 80ms delay </option>
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
              className=" cursor-pointer block appearance-none w-full bg-blue-500 border border-blue-500 hover:border-blue-700 text-white py-2 px-4 rounded leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setAlgorithm(e.target.value)
              }
            >
              <option value="0">Select Algorithm</option>
              <option value="BFS">Breath First Search</option>
              <option value="DFS">Depth First Search</option>
              <option value="BEST_FIRST">Best First Search</option>
              <option value="A_STAR">A*</option>
              <option value="DIJKSTRA">Dijkstra</option>
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
      </div>
      <div id='description' className="flex flex-col gap-1 items-left p-6  bg-[var(--secondary1)] rounded-b-2xl shadow-md hover:shadow-neutral-900" style={{ width: `${MAZE_WIDTH + 48}px` }}>
        <h2 className="text-sm lg:text-sm xl:text-lg font-semibold mb-2 text-gray-800">About this maze search:</h2>
        <div className="text-sm lg:text-sm xl:text-lg m-6 mb-2 overflow-hidden transition-all duration-500 ease-in-out">
          <p className=" leading-relaxed">
            By leveraging the computational prowess of Rust and its near-native
            performance in the browser through Wasm, we can witness these
            algorithms in action with remarkable speed. Adjust the delay to
            visualize the step-by-step process or set it to zero to see the
            results almost instantly. This project demonstrates the potential of
            using modern web technologies and efficient backend languages to
            create engaging and high-performance interactive experiences.
          </p>
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
            <li>
              <span className="text-black-500 font-semibold">Dijkstra's Algorithm:</span> Another algorithm that guarantees the
              shortest path in weighted graphs. It explores nodes in order of
              their current shortest distance from the start node.
            </li>
          </ul>
         
        </div>
      </div>
    </div>

  );
}


'use client';
import { useRef, useState, useEffect } from "react";
import init, * as wasm from '../hello-wasm/pkg/hello_wasm';
import dynamic from 'next/dynamic';
import { patterns_data } from "./helper/helper";

const CELL_SIZE = 5;
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';
// const DYING_FADE_DURATION_MS = 300;
const WIDTH = 200;
const HEIGHT = 100;



const ConwayGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [universe, setUniverse] = useState<wasm.Universe | null>(null);
  const [wasmMemory, setWasmMemory] = useState<WebAssembly.Memory | null>(null);
  const [speed, setSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPattern, setCurrentPattern] = useState('glider');
  const [numberOfPatterns, setNumberOfPatterns] = useState(1);


  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(100);  // to allow renderloop to access current speed
  const isPlayingRef = useRef<boolean>(false); // to allow renderloop to access current playing state

  const [isDragging, setIsDragging] = useState(false);
  const lastDraggedCellRef = useRef<{ row: number, col: number } | null>(null);
  // const fadeMapRef = useRef<Map<string, number>>(new Map()); // (row, col) => time remaining


  // keep the speedRef is sync with speed state
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        const wasmInit = await init();
        setWasmMemory(wasmInit.memory);

        const newUniverse = wasm.Universe.new(WIDTH, HEIGHT);
        setUniverse(newUniverse);
      } catch (e) {
        console.error('Error loading wasm module:', e);
      }
    };
    loadWasm();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      if (universe) {
        universe.free();
      }
    }
  }, [])

  // Main animation loop that controls the game timing
  const renderLoop = (timeStamp: number) => {

    // Exit early if core components aren't initialized
    if (!universe || !wasmMemory || !isPlayingRef.current) {
      if (isPlayingRef.current && (!universe || !wasmMemory)) {
        console.warn("Render loop called but universe or wasmMemory is not ready.")
      }
      return;
    }

    // Calculate the time elapsed since the last frame
    const elapsed = lastTimeRef.current === 0
      ? 0  // First frame case
      : timeStamp - lastTimeRef.current;

    // For debugging
    // console.log(`Time: ${timeStamp}, Last: ${lastTimeRef.current}, Elapsed: ${elapsed}, Speed: ${speed}`);

    // Only update the game state if enough time has passed (based on speed setting)
    if (elapsed >= speedRef.current || lastTimeRef.current === 0) {
      // Update our timestamp reference AFTER checking elapsed time
      lastTimeRef.current = timeStamp;
      const width = universe.width();
      const height = universe.height();

      // Update the game state
      universe.tick();


      // Get the cells that changed and update the display
      const changedCellsArray = universe.changed_cells();
      // updateDyingCells(previousCells);

      if (changedCellsArray.length > 0) {
        // If many cells changed, redraw everything for efficiency
        if (changedCellsArray.length > width * height * 0.5) {
          drawGrid();
          drawCells();
        } else {
          // Otherwise just update the changed cells
          drawChangedCells(changedCellsArray);
        }
      }
    }

    // Continue the animation loop if we're still in playing state
    if (isPlayingRef.current) {
      animationRef.current = requestAnimationFrame(renderLoop);
    }
  };



  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas || !universe) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = universe.width();
    const height = universe.height();

    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines
    for (let i = 0; i <= width; i++) {
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, height * CELL_SIZE);
    }

    // Horizontal lines
    for (let j = 0; j <= height; j++) {
      ctx.moveTo(0, j * CELL_SIZE);
      ctx.lineTo(width * CELL_SIZE, j * CELL_SIZE);
    }

    ctx.stroke();
  };

  const drawCells = () => {
    const canvas = canvasRef.current;
    if (!canvas || !universe || !wasmMemory) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    const width = universe.width();
    const height = universe.height();

    const cellsPtr = universe.cells();  // pointer to the start of cells data in wams memory
    const cells = new Uint8Array(wasmMemory.buffer, cellsPtr, width * height);

    // ctx.beginPath();
    // clear the canvas first
    ctx.clearRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);

    // Draw alive cells
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const idx = row * width + col;
        if (cells[idx] !== wasm.Cell.Alive) continue;

        ctx.fillRect(
          col * CELL_SIZE,
          row * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }

    drawGrid();
  };

  const drawChangedCells = (changedCellsArray: Uint32Array | number[]) => {
    const canvas = canvasRef.current;
    if (!canvas || !universe || !wasmMemory) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellsPtr = universe.cells();
    const width = universe.width();
    const height = universe.height();
    const cells = new Uint8Array(wasmMemory.buffer, cellsPtr, width * height);

    // Each pair of changedCellsArray represents a row and column
    for (let i = 0; i < changedCellsArray.length; i += 2) {
      if (i + 1 >= changedCellsArray.length) break;
      const row = changedCellsArray[i];
      const col = changedCellsArray[i + 1];
      const idx = row * width + col;

      ctx.fillStyle = cells[idx] === wasm.Cell.Alive ? ALIVE_COLOR : DEAD_COLOR;

      ctx.fillRect(
        col * CELL_SIZE,
        row * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    // Only redraw grid lines if there aren't too many changes
    if (changedCellsArray.length < width * height * 0.1) {
      // Redraw grid lines for all changed cells
      ctx.beginPath();
      ctx.strokeStyle = GRID_COLOR;

      for (let i = 0; i < changedCellsArray.length; i += 2) {
        if (i + 1 >= changedCellsArray.length) break;
        const row = changedCellsArray[i];
        const col = changedCellsArray[i + 1];
        // Draw rectangle outline for the cell
        ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      }

      ctx.stroke();
    } else {
      // If too many cells changed, just redraw the whole grid
      drawGrid();
    }
  }


  const toggleCellAtEvent = (event: React.MouseEvent<HTMLCanvasElement>, forceToggle = false) => {
    if (!universe || !canvasRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = universe.width();
    const height = universe.height();
    const boundingRect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / CELL_SIZE), height - 1);
    const col = Math.min(Math.floor(canvasLeft / CELL_SIZE), width - 1);

    if (!forceToggle && lastDraggedCellRef.current && lastDraggedCellRef.current.row === row && lastDraggedCellRef.current.col === col) {
      return; // avoid re-toggling the same cell during a drag if mouse hasn't moved to new cell
    }

    universe.toggle_cell(row, col);
    lastDraggedCellRef.current = { row, col };

    requestAnimationFrame(() => {
      if (!universe) return;
      const changedCellsArray = universe.changed_cells();
      if (changedCellsArray.length > 0) {
        drawChangedCells(changedCellsArray);
      } else { // fallback if somehow no changes reported, draw the specific cell
        drawChangedCells([row, col]);
      }
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying) return; // don't allow dragging while playing, or pause first
    setIsDragging(true);
    toggleCellAtEvent(event, true); // force toggle on the first click of a drag
    event.preventDefault();
  }
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || isPlaying) return;
    toggleCellAtEvent(event);
  }
  const handleMouseUp = () => {
    setIsDragging(false);
    lastDraggedCellRef.current = null;
  }
  const handleMouseLeave = () => { // reset dragging state on mouse leave
    if (isDragging) {
      setIsDragging(false);
      lastDraggedCellRef.current = null;
    }
  };



  // Function to toggle between play and pause states
  const togglePlay = () => {
    const newPlayingState = !isPlayingRef.current;
    isPlayingRef.current = newPlayingState;
    setIsPlaying(newPlayingState);
    if (newPlayingState) {
      // Reset the timer reference when starting play
      lastTimeRef.current = 0;

      // Make sure we don't create multiple animation loops
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      // Start a new animation loop
      animationRef.current = requestAnimationFrame(renderLoop);
    } else if (animationRef.current !== null) {
      // Stop the animation loop
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetGame = () => {
    if (!universe) return;
    universe.clear();
    drawGrid();
    drawCells();
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSpeed(300 - value);
  }


  // load the current pattern
  const loadPattern = () => {
    if (universe && wasmMemory) {
      const rawData = patterns_data[currentPattern];
      const pattern = new Uint32Array(rawData.data)
      const randomPositions = loadRandomPositions(numberOfPatterns, universe.width(), universe.height());
      universe.load_multiple_patterns_flat(pattern, rawData.width, rawData.height, randomPositions);
      drawGrid();
      drawCells();
    }
  }



  const loadRandomPositions = (numberOfPatterns: number, width: number, height: number): Uint32Array => {
    const randomPositions: number[] = [];
    for (let i = 0; i < numberOfPatterns; i++) {
      const row = Math.floor(Math.random() * height);
      const col = Math.floor(Math.random() * width);
      randomPositions.push(row, col);
    }
    const result = new Uint32Array(randomPositions);
    return result;
  }





  useEffect(() => {
    if (universe && wasmMemory) {
      const width = universe.width();
      const height = universe.height();

      if (canvasRef.current) {
        canvasRef.current.width = width * CELL_SIZE;
        canvasRef.current.height = height * CELL_SIZE;
      }

      drawGrid();
      drawCells();
    }
  }, [universe, wasmMemory]);




  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-35">
      <div style={{ width: `${WIDTH * CELL_SIZE}px` }}>
        <p className="font-bold text-lg text-gray-700 underline mb-4">
          Note: Not Yet Supported for mobile view.
        </p>

        <div id='header' className='flex flex-row justify-between items-center mb-4'>
          <h1>Conway&apos;s Game of Life</h1>
          <p className="text-xl">Implemented with Rust and WebAssembly</p>
        </div>

        <canvas
          ref={canvasRef}
          // onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="border border-gray-300 cursor-pointer shadow-lg"
        />

        <div className="flex gap-4 p-4  justify-between flex-row bg-white">
          <div className="flex items-center flex-row gap-4 ">
            <button id="play-pause" onClick={togglePlay} className="flex bg-green-500 text-white py-2 px-3.5 rounded-full hover:bg-green-600 items-center justify-center cursor-pointer">
              {isPlaying ? <span className="text-xl w-5 h-7 ml-0.5">⏸</span> : <span className="text-xl w-5 h-7 ml-0.5">▶</span>}
            </button>
            {/* <button id="step" onClick={handleStep}>Step</button> */}
            <button id="reset"
              className="flex bg-red-400 text-white py-2 px-3.5 rounded-full hover:bg-red-500 items-center justify-center cursor-pointer"
              onClick={() => resetGame()}>Reset</button>
          </div>
          <div className="flex items-center gap-2 flex-row">
            <select id="pattern"
              className="bg-gray-200 text-gray-700 border-none rounded-md px-2 py-1 w-32 outline-none"
              onChange={(e) => { setCurrentPattern(e.target.value as string) }}>
              {
                Object.keys(patterns_data).map((key, index) => {
                  return <option key={index} value={key}>{key}</option>
                })
              }
            </select>
            <input type="number"
              min="1"
              max='30'
              value={numberOfPatterns}
              onChange={(e) => { setNumberOfPatterns(parseInt(e.target.value)) }}
              className="bg-gray-200 text-gray-700 border-none rounded-md px-2 py-1 w-32 outline-none"
            />
            <button id="load"
              className="flex bg-amber-500 text-white py-2 px-3.5 rounded-full hover:bg-amber-600 items-center justify-center cursor-pointer"
              onClick={() => loadPattern()}>Load</button>
          </div>

          <div className="flex items-center gap-2">
            <span>{speed < 50 ? 'Fast' : speed < 150 ? 'Medium' : 'Slow'}</span>
            <input
              type="range"
              min="0"
              max="300"
              value={300 - speed}
              onChange={handleSpeedChange}
              className="w-32"
            />
            <span>Speed:</span>
          </div>
        </div>
        <div id='description' className="flex flex-col gap-1 items-left p-6 bg-[var(--secondary1)] rounded-b-2xl shadow-md hover:shadow-neutral-900">
          <div className="text-sm lg:text-sm xl:text-lg m-6 mb-2 overflow-hidden transition-all duration-500 ease-in-out flex flex-col gap-3">
            <p>
              Here&apos;s my implementation of <strong>Conway&apos;s Game of Life</strong> in Rust(WebAssembly) and Next(TypeScript). It&apos;s a fascinating cellular automaton where the fate of each cell – whether it lives or dies – is governed by a simple set of rules.
              Pause the simulation and click or drag across the grid to toggle individual cells between their alive and dead states.
            </p>
            <p> If you want to learn more about Conway&apos;s Game of Life, check out the <a className="underline text-blue-500" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noreferrer">Wikipedia page</a> or <a href="https://www.conwaylife.com/" className="underline text-blue-500" target="_blank" rel="noreferrer">ConwayLife.com</a>. </p>
            <p>
              I initially implemented this project as a pure React application, and I vividly recall my CPU fan working overtime/screaming! Now, I&apos;ve significantly improved
              performance by leveraging the power of <strong>WebAssembly (Wasm) with Rust</strong>. It&apos;s amazing how these four fundamental rules can give rise to incredibly complex and dynamic patterns.
            </p>
            <p className="mt-2 underline">Here are the simple rules that dictate the game:</p>
            <ul className="list-disc pl-5">
              <li>Any <strong>live</strong> cell with fewer than two live neighbours <strong>dies</strong> (underpopulation).</li>
              <li>Any <strong>live</strong> cell with two or three live neighbours <strong>lives</strong> on to the next generation.</li>
              <li>Any <strong>live</strong> cell with more than three live neighbours <strong>dies</strong> (overpopulation).</li>
              <li>Any <strong>dead</strong> cell with exactly three live neighbours becomes a <strong>live</strong> cell (reproduction).</li>
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
};

// Use dynamic import with ssr: false to avoid WebAssembly SSR issues
export default dynamic(() => Promise.resolve(ConwayGame), {
  ssr: false
});




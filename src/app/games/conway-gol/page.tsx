'use client';
import { useRef, useState, useEffect } from "react";
import init, * as wasm from '../hello-wasm/pkg/hello_wasm';
import dynamic from 'next/dynamic';

const CELL_SIZE = 5;
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';
const WIDTH = 200;
const HEIGHT = 100;



const ConwayGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [universe, setUniverse] = useState<wasm.Universe | null>(null);
  const [wasmMemory, setWasmMemory] = useState<WebAssembly.Memory | null>(null);
  const [speed, setSpeed] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const speedRef = useRef<number>(100);
  const isPlayingRef = useRef<boolean>(false);


  // keep the speedRef is sync with speed state
  useEffect(()=> {
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
  if (!universe || !wasmMemory) return;

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
    
    // Update the game state
    universe.tick();
    
    // Get the cells that changed and update the display
    const changedCellsArray = universe.changed_cells();
    
    if (changedCellsArray.length > 0) {
      // If many cells changed, redraw everything for efficiency
      if (changedCellsArray.length > WIDTH * HEIGHT * 0.3) {
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

    const cellsPtr = universe.cells();
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

    // // Draw dead cells
    // ctx.fillStyle = DEAD_COLOR;
    // for (let row = 0; row < height; row++) {
    //   for (let col = 0; col < width; col++) {
    //     const idx = row * width + col;
    //     if (cells[idx] !== wasm.Cell.Dead) continue;

    //     ctx.fillRect(
    //       col * CELL_SIZE,
    //       row * CELL_SIZE,
    //       CELL_SIZE,
    //       CELL_SIZE
    //     );
    //   }
    // }

    drawGrid();
  };

  const drawChangedCells = (changedCellsArray: Uint32Array | number[]) => {
    const canvas = canvasRef.current;
    if (!canvas || !universe || !wasmMemory) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = universe.width();
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(wasmMemory.buffer, cellsPtr, width * universe.height());

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
    if (changedCellsArray.length < WIDTH * HEIGHT * 0.1) {
      // Redraw grid lines for all changed cells
      ctx.beginPath();
      ctx.strokeStyle = GRID_COLOR;
      
      for (let i = 0; i < changedCellsArray.length; i += 2) {
        if (i + 1 >= changedCellsArray.length) break;
        const row = changedCellsArray[i];
        const col = changedCellsArray[i + 1];
        
        // Draw grid lines around this cell
        ctx.moveTo(col * CELL_SIZE, row * CELL_SIZE);
        ctx.lineTo((col + 1) * CELL_SIZE, row * CELL_SIZE);
        
        ctx.moveTo(col * CELL_SIZE, (row + 1) * CELL_SIZE);
        ctx.lineTo((col + 1) * CELL_SIZE, (row + 1) * CELL_SIZE);
        
        ctx.moveTo(col * CELL_SIZE, row * CELL_SIZE);
        ctx.lineTo(col * CELL_SIZE, (row + 1) * CELL_SIZE);
        
        ctx.moveTo((col + 1) * CELL_SIZE, row * CELL_SIZE);
        ctx.lineTo((col + 1) * CELL_SIZE, (row + 1) * CELL_SIZE);
      }
      
      ctx.stroke();
    } else {
      // If too many cells changed, just redraw the whole grid
      drawGrid();
    }
    
  }




  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!universe) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / CELL_SIZE), universe.height() - 1);
    const col = Math.min(Math.floor(canvasLeft / CELL_SIZE), universe.width() - 1);

    universe.toggle_cell(row, col);

   // Use requestAnimationFrame to avoid blocking the UI
    requestAnimationFrame(() => {
      if (!universe) return;
      universe.toggle_cell(row, col);
      const changedCellsArray = universe.changed_cells();
      drawChangedCells(changedCellsArray);
    });
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
      <div style = {{ width: `${WIDTH * CELL_SIZE}px` }}>
      <p className="font-bold text-lg text-gray-700 underline mb-4">
        Note: Not Yet Supported for mobile view.
      </p>

      <div id='header' className='flex flex-row justify-between items-center mb-4'>
        <h1>Conway's Game of Life</h1>
        <p className="text-xl">Implemented with Rust and WebAssembly</p>
      </div>

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="border border-gray-300"
        />

      <div className="flex gap-4 p-4  justify-between flex-row bg-white">
        <div className="flex items-center flex-row gap-4">
          <button id="play-pause" onClick={togglePlay}>
            {isPlaying ? '⏸' : '▶'}
          </button>
          {/* <button id="step" onClick={handleStep}>Step</button> */}
          <button id="reset" onClick={() => resetGame()}>Reset</button>
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
        <div className="text-sm lg:text-sm xl:text-lg m-6 mb-2 overflow-hidden transition-all duration-500 ease-in-out">
          <p>Conway's Game of Life is a cellular automaton where cells live or die based on simple rules.
            Click on cells to toggle them between alive and dead states.  </p>
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




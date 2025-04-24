declare module '*/hello_wasm.js' {
    import { MazeState } from '*/hello_wasm';
    const init: () => Promise<void>;
    export { MazeState };
    export default init;
  }
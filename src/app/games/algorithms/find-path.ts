import { a_star_algorithm } from "./astar";
import { best_first_algorithm } from "./best-first";
import { bfs_algorithm } from "./bfs";
import { dfs_algorithm } from "./dfs";
import { color_cell } from "./helper/helper_function";



export interface TsImplementationProps{
    maze_grid: string[][];
    canvas: HTMLCanvasElement;
    start: [number, number];
    target: [number, number];
    delay_ms?: number;
}




export class ts_implementation {
    private maze_grid: string[][];
    private canvas: HTMLCanvasElement;
    private start: [number, number];
    private target: [number, number];


    constructor(props: TsImplementationProps) {
        this.maze_grid = props.maze_grid;
        this.canvas = props.canvas;
        this.start = props.start;
        this.target = props.target;
    }


    public async find_path(delay_ms: number, algorithm: string){
        switch (algorithm) {
            case 'BFS':
                return await this.bfs(delay_ms);
            case 'DFS':
                return await this.dfs(delay_ms);
            case 'BestFirst':
                return await this.best_first(delay_ms);
            case 'AStar':
                return await this.a_star(delay_ms);
            default:
                return 'Invalid algorithm';
        }
    }


    public async bfs(delay_ms: number) {
        const parent =  await bfs_algorithm({
            maze_grid: this.maze_grid,
            canvas: this.canvas,
            start: this.start,
            target: this.target,
            delay_ms: delay_ms,
        });
      return this.recontruct_path(parent, this.target);
    }

    public async dfs(delay_ms: number) {
        const parent =  await dfs_algorithm({
            maze_grid: this.maze_grid,
            canvas: this.canvas,
            start: this.start,
            target: this.target,
            delay_ms: delay_ms,
        });
       return this.recontruct_path(parent, this.target);

    }
    public async best_first(delay_ms: number) {
      const parent = await  best_first_algorithm({
            maze_grid: this.maze_grid,
            canvas: this.canvas,
            start: this.start,
            target: this.target,
            delay_ms: delay_ms,
        });
       return this.recontruct_path(parent, this.target);

    }
    public async a_star(delay_ms: number) {
        const parent =  await a_star_algorithm({
            maze_grid: this.maze_grid,
            canvas: this.canvas,
            start: this.start,
            target: this.target,
            delay_ms: delay_ms,
        })

        return this.recontruct_path(parent, this.target);
    }


    recontruct_path(parent: Map<string, [number, number]> | null, target: [number, number]) : boolean {
        if (!parent) {
            return false;
        }

        const path: Array<[number, number]> = [];
        let current = target;
        while (parent.has(`${current[0]},${current[1]}`)) {
            path.push(current);
            current = parent.get(`${current[0]},${current[1]}`)!;
            color_cell(this.canvas, current[0], current[1], "red", target);       
        }
        path.push(this.start);
        // path.reverse();  
        // return path;
        return true;
    }
}

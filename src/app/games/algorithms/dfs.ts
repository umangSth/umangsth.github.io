import { TsImplementationProps } from "./find-path";
import { color_cell, sleep } from "./helper/helper_function";

export async function dfs_algorithm(args : TsImplementationProps):  Promise<Map<string, [number, number]> | null> {
    
    const delay_ms = args.delay_ms || 0;
    const rows = args.maze_grid.length;
    const cols = args.maze_grid[0].length;
    const start = args.start;
    const target = args.target;

    const queue:[number, number][] = [start];
    const visited = new Set<string>();
    const parent = new Map<string, [number, number]>();


    visited.add(`${start[0]},${start[1]}`);
    
    const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
        const current = queue.pop();
        const [cx, cy] = current ? current : [null, null];


        if(cx !== null && cy !== null) {
            if (cx === target[0] && cy === target[1]) {
                return parent || null;
            }

            for (const [dx, dy] of moves) {
                const new_x = cx + dx;
                const new_y = cy + dy;

                if (
                    new_x >= 0 &&
                    new_x < cols &&
                    new_y >= 0 && 
                    new_y < rows &&
                    args.maze_grid[new_y][new_x] === ' ' &&
                    !visited.has(`${new_x},${new_y}`)
                ) {
                    visited.add(`${new_x},${new_y}`);
                    parent.set(`${new_x},${new_y}`, [cx, cy]);
                    queue.push([new_x, new_y]);
                    color_cell(args.canvas,new_x, new_y, "lightcoral", target);
                    if (delay_ms > 0) {
                        await sleep(delay_ms);
                    }
                }
            }
        }
    }
    return null;
}
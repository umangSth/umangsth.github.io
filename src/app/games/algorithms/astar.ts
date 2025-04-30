import { TsImplementationProps } from "./find-path";
import { color_cell, heuristic, sleep } from "./helper/helper_function";
import { PriorityQueue } from "./helper/priority_queue";

export async function a_star_algorithm(args : TsImplementationProps): Promise<Map<string, [number, number]> | null> {

    const delay_ms = args.delay_ms || 0;
    const rows = args.maze_grid.length;
    const cols = args.maze_grid[0].length;
    const start = args.start;
    const target = args.target;

    const pq = new PriorityQueue<[number, number]>();
    pq.enqueue(start, heuristic(start, target));

    const g_score = new Map<string, number>();
    g_score.set(`${start[0]},${start[1]}`, 0);


    const parent = new Map<string, [number, number]>();
    const visited = new Set<string>();
    visited.add(`${start[0]},${start[1]}`);

    const moves = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (!pq.isEmpty()) {
        const current = pq.dequeue();
        if (current) {
            if (current[0] === target[0] && current[1] === target[1]) {
                return parent || null;
            }

            const [cx, cy] = current;

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
                    const tentative_g_score = g_score.get(`${cx},${cy}`)! + 1;
                    if(!g_score.has(`${new_x},${new_y}`) || tentative_g_score < g_score.get(`${new_x},${new_y}`)!) {
                        g_score.set(`${new_x},${new_y}`, tentative_g_score);
                        const f_score = g_score.get(`${new_x},${new_y}`)! + heuristic([new_x, new_y], target);
                        pq.enqueue([new_x, new_y], f_score);
                        parent.set(`${new_x},${new_y}`, [cx, cy]);
                        visited.add(`${new_x},${new_y}`);
                        color_cell(args.canvas, new_x, new_y, "lightcoral", target);
                        if (delay_ms > 0) {
                            await sleep(delay_ms);
                        }
                    }
                }            
            }
        }
    }

    return null;
}
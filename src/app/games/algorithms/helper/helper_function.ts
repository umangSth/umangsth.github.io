export interface MazeInfo {
    target: [number, number];
    computer_player: [number, number];
}

export const MAZE_BLOCK_SIZE = 8.0;

export function from_string_to_game_state(maze_data: string): MazeInfo | null {
    // target:(12, 36), computer_player:(63, 53)

    try {
        const commaSplit = maze_data.split('&');
        const targetTuple = commaSplit[0].split(':')[1].split(',');
        const computer_playerTuple = commaSplit[1].split(':')[1].split(',');

        const targetX = parseInt(targetTuple[0].replace('(', '').trim(), 10);
        const targetY = parseInt(targetTuple[1].replace(')', '').trim(), 10);
        const computerPlayerX = parseInt(computer_playerTuple[0].replace('(', '').trim(), 10);
        const computerPlayerY = parseInt(computer_playerTuple[1].replace(')', '').trim(), 10);

        return {
            target: [targetX, targetY],
            computer_player: [computerPlayerX, computerPlayerY],
        }
    } catch (error) {
        console.error('Failed to parse maze data:', error);
        return null;
    }
}



export function string_to_maze_grid(maze_data: string): string[][] {
    const rows = maze_data.split('\n');
    return rows.map(((row: string) => row.trim().split('')))
}


export function color_cell(canvas: HTMLCanvasElement, x: number, y: number, color: string, target: [number, number]) {
    const targetX = target[0];
    const targetY = target[1];

    if (x !== targetX || y !== targetY) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = color;
            ctx.fillRect(x * MAZE_BLOCK_SIZE, y * MAZE_BLOCK_SIZE, MAZE_BLOCK_SIZE, MAZE_BLOCK_SIZE);
        }
    }
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}



export function heuristic(current: [number, number], target: [number, number]): number {
    return Math.abs(target[0] - current[0]) + Math.abs(target[1] - current[1]);
}




import { extract_duck_flapping_frame } from "../helper_function";



type Duck_Direction = 'left' | 'right';
const FRAME_WIDTH = 30;
const FRAME_HEIGHT = 20;


export async function drawDuck(
    ctx: CanvasRenderingContext2D,
    duckSprite: HTMLImageElement,
    duckDirection: Duck_Direction,
    duckFrameIndex: number,
    x: number,
    y: number,
) {
    if (!duckSprite) return;
   
    const sx = duckFrameIndex * FRAME_WIDTH;

    const dWidth = FRAME_WIDTH * 2;
    const dHeight = FRAME_HEIGHT * 2;

    ctx.save();

    if (duckDirection === 'right') {
        ctx.translate(x + dWidth, y);
        ctx.scale(-1, 1); // 3. Flip the world

        ctx.drawImage(
            duckSprite,
            sx, 0, FRAME_WIDTH, FRAME_HEIGHT,
            0, 0, dWidth, dHeight)
    } else {

        ctx.drawImage(
            duckSprite,
            sx, 0, FRAME_WIDTH, FRAME_HEIGHT,
            x, y, dWidth, dHeight
        )
    }

    ctx.restore();
}





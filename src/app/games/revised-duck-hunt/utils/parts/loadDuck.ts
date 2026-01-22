


type Duck_Direction = 'left' | 'right';
type Duck_Frame_Type = 'stand' | 'glide' | 'flight';
const FRAME_WIDTH = 30;
const FRAME_HEIGHT = 20;


export async function drawDuck(
    ctx:CanvasRenderingContext2D, 
    duckSprite: HTMLImageElement,
    duckDirection:Duck_Direction, 
    duckFrameType: Duck_Frame_Type,
    x: number,
    y: number
){
    if (!duckSprite) return;

    const frameMap = { 'stand': 0, 'flight' : 1, 'glide' : 3 }
    const frameIndex = frameMap[duckFrameType] || 0;
    const sx = frameIndex * FRAME_WIDTH;


    const dWidth = FRAME_WIDTH * 2;
    const dHeight = FRAME_HEIGHT * 2;

    ctx.save();

    if (duckDirection === 'right'){
        ctx.scale(-1, 1);
        ctx.drawImage(
            duckSprite,
            sx, 0, FRAME_WIDTH, FRAME_HEIGHT
            -x, -dWidth, y, dWidth, dHeight
        );
    } else {

        ctx.drawImage(
            duckSprite,
            sx, 0, FRAME_WIDTH, FRAME_HEIGHT,
            x, y, dWidth, dHeight
        )
    }

   ctx.restore();
}






import { WIDTH, HEIGHT } from './constants';
import { loadBackGround } from './parts/loadBackGround';
import { drawDuck } from './parts/loadDuck';
import { loadImage, extract_duck_co, extract_duck_packed_state, extract_duck_flapping_frame } from './helper_function';
import { GREEN_FIELD_SRC, GREEN_HILLS_1_SRC, MOUNTAINS_SRC, CLOUD_SKY_SRC, DUCK_SPRITE_SRC_LEFT } from './constants';
import { get_duck_co, get_duck_states } from '../../hello-wasm/pkg/hello_wasm';

export const Assets = {
    duckSprite: null as HTMLImageElement | null,
    backgrounds: [] as HTMLImageElement[],
    isReady: false
}

let cameraX = 0;
export function gameLoop(ctx: CanvasRenderingContext2D, isRunning: React.RefObject<boolean | null>, time?: number) {

    // check the ref: if the component unmounted, stop the loop immediately
    if (!isRunning.current) return;

    // Clear Canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const duck_ptr = get_duck_co()
    const duck = extract_duck_co(duck_ptr);
    const duck_states = extract_duck_packed_state(get_duck_states());


    const duckDirection = duck_states.isRight ? 'right' : 'left';
    const duckFrameType = duck_states.isFlapping ? 'flapping' : duck_states.isStanding ? 'standing' : 'glide';
    let duckFrameIndex = 3;

    if (!duck_states.isStanding) {
        if (duck_states.isRight) {
            cameraX += 5;
        } else {
            cameraX -= 5;
        }
    }
    // Draw Backgrounds from global constants
    if (Assets.backgrounds) {
        loadBackGround(ctx, {...duck, cameraX})
    }

    if (Assets.duckSprite) {
        if (time && time > 0) {
            switch (duckFrameType) {
                case 'glide':
                    duckFrameIndex = 3;
                    break;
                case 'flapping':
                    duckFrameIndex = extract_duck_flapping_frame(time);
                    break;
                case 'standing':
                    duckFrameIndex = 0;
                    break;
                default:
                    duckFrameIndex = 3
                    break;
            }
        }

        drawDuck(ctx, Assets.duckSprite, duckDirection, duckFrameIndex, duck.x, duck.y)
    }

    requestAnimationFrame((time) => gameLoop(ctx, isRunning, time))
}



export async function loadAllAssets() {
    Assets.duckSprite = await loadImage(DUCK_SPRITE_SRC_LEFT);

    const sources = [CLOUD_SKY_SRC, MOUNTAINS_SRC, GREEN_HILLS_1_SRC, GREEN_FIELD_SRC];

    Assets.backgrounds = await Promise.all(sources.map(src => loadImage(src)));

    Assets.isReady = true;
    console.log("All assets loaded into global store");
}









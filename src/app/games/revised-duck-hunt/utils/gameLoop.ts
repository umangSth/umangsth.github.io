
import {WIDTH, HEIGHT} from './constants';
import { loadBackGround } from './parts/loadBackGround';
import { drawDuck } from './parts/loadDuck';
import { loadImage, extract_duck_co } from './helper_function';
import {GREEN_FIELD_SRC, GREEN_HILLS_1_SRC,MOUNTAINS_SRC, CLOUD_SKY_SRC, DUCK_SPRITE_SRC_LEFT} from './constants';
import { get_duck_co } from '../../hello-wasm/pkg/hello_wasm';

export const Assets = {
    duckSprite: null as HTMLImageElement | null,
    backgrounds: [] as HTMLImageElement[],
    isReady: false
}


export function gameLoop(ctx: CanvasRenderingContext2D, isRunning: React.RefObject<boolean | null>){

    // check the ref: if the component unmounted, stop the loop immediately
    if (!isRunning.current) return;

    // Clear Canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    const duck_ptr = get_duck_co()
    const duck = extract_duck_co(duck_ptr);


    // Draw Backgrounds from global constants
   if (Assets.backgrounds){
       loadBackGround(ctx)
   }

    if (Assets.duckSprite) {
        drawDuck(ctx, Assets.duckSprite, 'left', 'glide', duck.x, duck.y)
    }

    requestAnimationFrame(() => gameLoop(ctx, isRunning))
}



export async function loadAllAssets() {
    Assets.duckSprite = await loadImage(DUCK_SPRITE_SRC_LEFT);

    const sources = [CLOUD_SKY_SRC, MOUNTAINS_SRC, GREEN_HILLS_1_SRC, GREEN_FIELD_SRC];
    
    Assets.backgrounds = await Promise.all(sources.map(src => loadImage(src)));

    Assets.isReady = true;
    console.log("All assets loaded into global store");
}








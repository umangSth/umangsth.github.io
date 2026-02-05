import { CLOUD_SKY_SRC, GREEN_FIELD_SRC, GREEN_HILLS_1_SRC, HEIGHT, MOUNTAINS_SRC } from "../constants";
import { Assets } from "../gameLoop";

// width and height constant of the image
const IMAGE_WIDTH = 5600;
const IMAGE_HEIGHT = 750;
const CLOUD_WIDTH = 2800;

// aspect ratio based on the canvas height
const scaledWidth = IMAGE_WIDTH * (HEIGHT/IMAGE_HEIGHT)
const scaledCloudWidth = CLOUD_WIDTH * (HEIGHT/IMAGE_HEIGHT)


const Background_Layer:Record<string, number>={
    [CLOUD_SKY_SRC]:0.1,
    [MOUNTAINS_SRC]:0.3,
    [GREEN_HILLS_1_SRC]:0.6,
    [GREEN_FIELD_SRC]:0.9
}



// load the bg_images
export async function loadBackGround(ctx: CanvasRenderingContext2D, duck_co: {x:number, y:number}){
    try{
        Assets.backgrounds.forEach((img) => {
            let tempWidth = scaledWidth;
            
           
            const speed = Background_Layer[img.currentSrc] || 1;
             // as the cloud bg image is not width of 5600, so changing its width to 2800
            if(img.currentSrc.includes('cloud')){
                tempWidth = scaledCloudWidth;
            }
            const xOffset = -(duck_co.x * speed) % tempWidth;
            ctx.drawImage(img, xOffset, 0, tempWidth, HEIGHT);
            if (xOffset < 0){
                ctx.drawImage(img, xOffset + tempWidth, 0, tempWidth, HEIGHT)
            }
        })
    }catch(error) {
         throw error;
    }
}

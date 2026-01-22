import { HEIGHT } from "../constants";
import { Assets } from "../gameLoop";

// width and height constant of the image
const IMAGE_WIDTH = 5600;
const IMAGE_HEIGHT = 750;
const CLOUD_WIDTH = 2800;

// aspect ratio based on the canvas height
const scaledWidth = IMAGE_WIDTH * (HEIGHT/IMAGE_HEIGHT)
const scaledCloudWidth = CLOUD_WIDTH * (HEIGHT/IMAGE_HEIGHT)
// load the bg_images
export async function loadBackGround(ctx: any){
    try{
        Assets.backgrounds.forEach((img) => {
            let tempWidth = scaledWidth;
            // as the cloud bg image is not width of 5600, so changing its width to 2800
            if(img.currentSrc.includes('cloud')){
                tempWidth = scaledCloudWidth;
            }
            ctx.drawImage(img, 0, 0, tempWidth, HEIGHT);
        })
    }catch(error) {
         throw error;
    }
}

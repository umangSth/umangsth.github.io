
// function to load the image, takes src as argument
export function loadImage(src:string):Promise<HTMLImageElement>{
    return new Promise((resolve, reject)=>{
           const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject;
            img.src =  src;
    })
}



// function to extract duck coordinates 
export function extract_duck_co(co: number):{x:number, y:number} {
    const  x = co >>> 16;
    const y = co & 0xFFFF;
    return {x, y}
}


interface Duck_State {
    isRight: boolean,
    isFlapping: boolean,
    isStanding: boolean
}
export function extract_duck_packed_state(state: number):Duck_State{
    const isRight = (state & (1 << 0)) !== 0;
    const isFlapping  = (state & (1 << 1)) !== 0;
    const isStanding = (state & (1 << 2 )) !== 0;

    return {
        isRight,
        isFlapping,
        isStanding
    }
}


// Return the frame for flapping animation
export function extract_duck_flapping_frame(time: number):number{
    return Math.floor((time / 50) % 4) + 1
}



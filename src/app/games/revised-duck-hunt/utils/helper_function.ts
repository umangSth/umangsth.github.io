
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



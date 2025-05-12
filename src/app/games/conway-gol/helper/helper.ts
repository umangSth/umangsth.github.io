export const patterns = {
    glider: {
        width: 3,
        height: 3,
        data: [0,1, 1,2, 2,0, 2,1, 2,2]
    },
    simpleStillLifeBlock: {
        width: 2, 
        height: 2,
        data: [0,0, 0,1, 1,0, 1,1],
    },
    simpleOscillatorBlinker: {
    width: 1, height: 3,
    data: [0,0, 1,0, 2,0] // or [0,0, 0,1, 0,2] depending on orientation
  }
}
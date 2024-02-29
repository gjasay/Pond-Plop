import { Texture } from "pixi.js";
import { renderAnimatedSprite } from "./my_functions";

const waterImages = [
    "assets/water_frames/tile000.png",
    "assets/water_frames/tile001.png",
    "assets/water_frames/tile002.png",
    "assets/water_frames/tile003.png",
    "assets/water_frames/tile004.png",
    "assets/water_frames/tile005.png",
    "assets/water_frames/tile006.png",
    "assets/water_frames/tile007.png",
    "assets/water_frames/tile008.png",
    "assets/water_frames/tile009.png",
    "assets/water_frames/tile010.png",
    "assets/water_frames/tile011.png",
    "assets/water_frames/tile012.png",
    "assets/water_frames/tile013.png",
    "assets/water_frames/tile014.png",
    "assets/water_frames/tile015.png",
    "assets/water_frames/tile016.png",
    "assets/water_frames/tile017.png",
    "assets/water_frames/tile018.png",
    "assets/water_frames/tile019.png",
    "assets/water_frames/tile020.png",
    "assets/water_frames/tile021.png",
    "assets/water_frames/tile022.png",
    "assets/water_frames/tile023.png",
    "assets/water_frames/tile024.png",
    "assets/water_frames/tile025.png",
    "assets/water_frames/tile026.png",
    "assets/water_frames/tile027.png",
    "assets/water_frames/tile028.png",
    "assets/water_frames/tile029.png",
    "assets/water_frames/tile030.png",
    "assets/water_frames/tile031.png",
  ];

export const createBackground = () => {
    const waterFrames = [];
      
    for (let i = 0; i < 32; i++) {
        const texture = Texture.from(waterImages[i]);
        waterFrames.push(texture);
    }
      
    const backgroundWater = [];
    const backgroundWaterSprites = [];
      
    // Render background water
      
    for (let j = 0; j < 25; j++) {
        for (let i = 0; i < 25; i++) {
          backgroundWater.push({
            x: 32 * i,
            y: 32 * j,
            width: 32,
            height: 32,
            textures: waterFrames,
          });
          backgroundWaterSprites.push(
            renderAnimatedSprite(backgroundWater[backgroundWater.length - 1]),
          );
        }
    }
      
      // Animate water
      
    backgroundWaterSprites.forEach((i) => {
        i.animationSpeed = 0.1;
        i.play();
    });
}
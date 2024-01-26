// Render animated sprites

import { AnimatedSprite, Sprite } from "pixi.js";
import { app, totalTadpoles } from "./main";

export function renderAnimatedSprite(sprite) {
    let newSprite = new AnimatedSprite(sprite.textures)
    newSprite.x = sprite.x;
    newSprite.y = sprite.y;
    newSprite.width = sprite.width;
    newSprite.height = sprite.height;
    app.stage.addChild(newSprite)
    newSprite.play()
    return newSprite
  
}
  // Render static sprites
  
  export function renderSprite(sprite) {
    let newSprite = Sprite.from(sprite.texture);
    newSprite.x = sprite.x;
    newSprite.y = sprite.y;
    newSprite.width = sprite.width;
    newSprite.height = sprite.height;
    app.stage.addChild(newSprite)
    return newSprite
  }

  export function isTileOccupied(x, y) {
    return totalTadpoles.some(tadpole => tadpole.x === x && tadpole.y === y);
  }
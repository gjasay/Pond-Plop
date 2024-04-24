import { renderSprite } from "./my_functions";

export const lilyPadObjects = [];
export const lilyPadSprites = [];

export class LilyPad {
  constructor(x, y) {
    this.width = 32;
    this.height = 32;
    this.x = x;
    this.y = y;
    this.texture = "assets/lily_pad.png";
  }
}

export function createGameboard() {
  for (let j = 5; j <= 10; j++) {
    for (let i = 8; i <= 13; i++) {
      lilyPadObjects.push(
        new LilyPad(i * 36, j * 36),
      );
      lilyPadSprites.push(
        renderSprite(lilyPadObjects[lilyPadObjects.length - 1]),
      );
    }
  }
}


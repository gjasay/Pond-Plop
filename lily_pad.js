import { app } from "./app";
import { renderSprite } from "./my_functions";

export const lilyPadObjects = [];
export const lilyPadSprites = [];

export function createGameboard() {
  for (let j = 5; j <= 10; j++) {
    for (let i = 8; i <= 13; i++) {
      lilyPadObjects.push({
        x: 36 * i,
        y: 36 * j,
        width: 32,
        height: 32,
        texture: "assets/lily_pad.png",
      });
      lilyPadSprites.push(
        renderSprite(lilyPadObjects[lilyPadObjects.length - 1]),
      );
    }
  }
}

export class LilyPad {
  constructor(x, y) {
    this.width = 32;
    this.height = 32;
    this.x = x;
    this.y = y;
    this.texture = "assets/lily_pad.png";
  }

  render() {
    renderSprite({
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      texture: this.texture,
    });
  }
}

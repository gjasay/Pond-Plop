import { LilyPad, lilyPadObjects, lilyPadSprites } from "./lily_pad";
import { totalTadpoles } from "./main";
import { renderSprite } from "./my_functions";

export let animating = false;

export class Player {
  constructor(color, num) {
    this.playerNumber = num;
    this.tadpoles = [];
    this.maxTadpoles = 8;
    this.tadpolesInHand = [];
    this.frogs = [];
    this.maxFrogs = 0;
    this.frogsInHand = 0;
    this.color = color;
  }

  spawnTadpoles() {
    while (this.tadpolesInHand.length < this.maxTadpoles) {
      this.tadpolesInHand.push(
        renderSprite({
          width: 32,
          height: 32,
          texture: this.color[0],
        }),
      );
    }
  }
}

import { renderSprite } from "./my_functions";

export class Player {
  constructor(color, num) {
    this.playerNumber = num;
    this.tadpoles = [];
    this.maxTadpoles = 8;
    this.tadpolesInHand = [];
    this.frogs = [];
    this.maxFrogs = 0;
    this.frogsInHand = [];
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
  // FOR TESTING PURPOSES
  spawnFrogs() {
    while (this.frogsInHand.length < 8) {
      this.frogsInHand.push(
        renderSprite({
          width: 32,
          height: 32,
          texture: this.color[1],
        }),
      );
    }
  }
}

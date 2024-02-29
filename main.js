import { Texture } from "pixi.js";
import {
  isTileOccupied,
  renderAnimatedSprite,
  renderSprite,
} from "./my_functions";
import {
  LilyPad,
  createGameboard,
  lilyPadObjects,
  lilyPadSprites,
} from "./lily_pad";
import { Player } from "./player";
import { renderPlayerUI, updatePlayerUI } from "./ui";
import { app } from "./app";
import { Tadpole } from "./tadpole";
import { Frog } from "./frog";
import { createBackground } from "./water";

export const totalTadpoles = [];
export const totalFrogs = [];

const orange = ["assets/orange_tadpole.png", "assets/orange_frog.png"];
const purple = ["assets/tadpole.png", "assets/purple_frog.png"];
export const player1 = new Player(orange, 1);
export const player2 = new Player(purple, 2);

export const main = () => {
// Clear screen
app.stage.removeChildren();

const tadpole = new Tadpole();
const frog = new Frog();

let playerTurn = "player1";

// Render water background
createBackground();

// Render lily pad gameboard and player UI element
createGameboard();

for (let i = 0; i < 36; i++) {
  app.stage.addChild(lilyPadSprites[i]);
}

renderPlayerUI();
player1.spawnTadpoles();
player2.spawnTadpoles();
// FOR TESTING PURPOSES
// player1.spawnFrogs();
// player2.spawnFrogs();

// Player interaction

for (let i = 0; i < lilyPadSprites.length; i++) {
  lilyPadSprites[i].eventMode = "static";
  lilyPadSprites[i].onclick = () => {
    if (!isTileOccupied(lilyPadObjects[i].x, lilyPadObjects[i].y)) {
      if (playerTurn == "player1") {
        placeTadpole(player1, i);
        playerTurn = "player2";
      } else if (playerTurn == "player2") {
        placeTadpole(player2, i);
        playerTurn = "player1";
      }
    }
  };
  lilyPadSprites[i].on("rightclick", (event) => {
    if (!isTileOccupied(lilyPadObjects[i].x, lilyPadObjects[i].y)) {
      if (playerTurn == "player1") {
        placeFrog(player1, i);
      } else if (playerTurn == "player2") {
        placeFrog(player2, i);
      }
    }
  });
}

function placeTadpole(player, index) {
  tadpole.place(index, player);
  app.stage.addChild(totalTadpoles[totalTadpoles.length - 1].sprite);
  updatePlayerUI();
}

function placeFrog(player, index) {
  if (player.frogsInHand.length === 0) alert("You have no frogs to place!");
  else {
    frog.place(player, index);
    app.stage.addChild(totalFrogs[totalFrogs.length - 1].sprite);
    updatePlayerUI();
    if (player === player1) {
      playerTurn = "player2";
    } else if (player === player2) {
      playerTurn = "player1";
    }
  }
}
}

import { Texture } from "pixi.js";
import { isTileOccupied, renderAnimatedSprite, renderSprite } from "./my_functions";
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

// Setup game window

document.body.appendChild(app.view);

const orange = ["assets/orange_tadpole.png", "assets/orange_frog.png"];
const purple = ["assets/tadpole.png", "assets/purple_frog.png"];

export const player1 = new Player(orange, 1);
export const player2 = new Player(purple, 2);

const tadpole = new Tadpole();
const frog = new Frog();

let playerTurn = "player1";

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

const waterFrames = [];

for (let i = 0; i < 32; i++) {
  const texture = Texture.from(waterImages[i]);
  waterFrames.push(texture);
}

const backgroundWater = [];
const backgroundWaterSprites = [];

export const totalTadpoles = [];
export const totalFrogs = [];

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
});

// Render lily pad gameboard and player UI element
createGameboard();

for (let i = 0; i < 36; i++) {
  app.stage.addChild(lilyPadSprites[i]);
}

renderPlayerUI();
player1.spawnTadpoles();
player2.spawnTadpoles();

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
  lilyPadSprites[i].on('rightclick', (event) => {
    if (!isTileOccupied (lilyPadObjects[i].x, lilyPadObjects[i].y)) {
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
  if(player.frogsInHand.length === 0) alert("You have no frogs to place!");
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

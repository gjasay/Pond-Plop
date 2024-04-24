import { isTileOccupied } from "./my_functions";
import {
  createGameboard,
  lilyPadObjects,
  lilyPadSprites,
} from "./lilypad";
import { Player } from "./player";
import { renderPlayerUI, updatePlayerUI } from "./ui";
import { app } from "./app";
import { Tadpole, checkTadpoleRow } from "./tadpole";
import { Frog } from "./frog";
import { createBackground } from "./water";
import { Text } from "pixi.js";
import { gameId, ws } from "./title_screen";

class Main {
  constructor() {
    this.player1 = new Player(1);
    this.player2 = new Player(2);
  }

  start() {
    // Clear screen
    app.stage.removeChildren();

    // Render water background
    createBackground();

    // Render lily pad gameboard and player UI element
    createGameboard();

    for (let i = 0; i < 36; i++) {
      app.stage.addChild(lilyPadSprites[i]);
    }

    renderPlayerUI();
    this.player1.spawnTadpoles();
    this.player2.spawnTadpoles();
    // FOR TESTING PURPOSES
    this.player1.spawnFrogs();
    this.player2.spawnFrogs();
    updatePlayerUI();

    // Player interaction
    for (let i = 0; i < lilyPadSprites.length; i++) {
      lilyPadSprites[i].eventMode = "static";
      lilyPadSprites[i].onclick = () => {
        if (!isTileOccupied(lilyPadObjects[i].x, lilyPadSprites[i].y)) {
          this.placeTadpole(this.player1, i);
        }
      };
      lilyPadSprites[i].on("rightclick", (event) => {
        if (!isTileOccupied(lilyPadSprites[i].x, lilyPadSprites[i].y)) {
          this.placeFrog(this.player1, i);
        }
      });
    }
  }

  placeTadpole(player, index) {
    const tadpole = new Tadpole();
    tadpole.place(index, player);
    app.stage.addChild(tadpole.sprite);
    updatePlayerUI();
  }

  placeFrog(player, index) {
    const frog = new Frog();
    frog.place(player, index);
    app.stage.addChild(frog.sprite);
    updatePlayerUI();
  }
}

export let totalTadpoles = [];
export let totalFrogs = [];

const orange = ["assets/orange_tadpole.png", "assets/orange_frog.png"];
const purple = ["assets/tadpole.png", "assets/purple_frog.png"];
export const player1 = new Player(orange, 0);
export const player2 = new Player(purple, 1);
export const PLAYERS = [player1, player2];

let gameIdText;

export const main = (isHost, isOnline = false) => {
  // Clear screen
  app.stage.removeChildren();
  const tadpole = new Tadpole();
  const frog = new Frog();
  
  let playerTurn = "player1";
  let canPlace = isHost ? true : false;

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
  updatePlayerUI();
  
  function playerInteraction () {
    for (let i = 0; i < lilyPadSprites.length; i++) {
      lilyPadSprites[i].eventMode = "static";
      lilyPadSprites[i].onclick = () => {
        if (!isTileOccupied(lilyPadObjects[i].x, lilyPadSprites[i].y)) {
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
        if (!isTileOccupied(lilyPadSprites[i].x, lilyPadSprites[i].y)) {
          if (playerTurn == "player1") {
            placeFrog(player1, i);
            playerTurn = "player2";
          } else if (playerTurn == "player2") {
            placeFrog(player2, i);
            playerTurn = "player1";
          }
        }
      });
    }
  }

  function placeTadpole(player, index) {
    if (isOnline) {
      if (!canPlace) return;
      ws.send(JSON.stringify({type: "placeTadpole", index: index, color: player.color[0], playerid: isHost ? 0 : 1}));
    } else {
      tadpole.place(index, player.playerNumber, player.color[0]);
      app.stage.addChild(totalTadpoles[totalTadpoles.length - 1].sprite);
      updatePlayerUI();
    }
  }

  function placeFrog(player, index) {
    if (player.frogsInHand.length === 0) alert("You have no frogs to place!");
    if (isOnline) {
      if (!canPlace) return;
      ws.send(JSON.stringify({type: "placeFrog", index: index, color: player.color[1], playerid: isHost ? 0 : 1}));
    }
    else {
      frog.place(index, player.playerNumber, player.color[1]);
      app.stage.addChild(totalFrogs[totalFrogs.length - 1].sprite);
      updatePlayerUI();
    }
  }
  if (gameId !== undefined && isHost && isOnline) {
    gameIdText = new Text(`Waiting for player to join...
Game ID: ${gameId}`, {
      fontFamily: "Comic Sans MS",
      fontSize: 32,
      fill: 0xFF7F50,
      align: "center",
    });
  
    gameIdText.position.set(190, 500);
    app.stage.addChild(gameIdText);
  } else {
    playerInteraction();
  }

  if (isOnline) {
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      switch(data.type) {
        case "joinedGame":
          if (data.success) {
            console.log("Player joined game");
            app.stage.removeChild(gameIdText);
            playerInteraction();
          }
          break; 
        case "placeTadpole":
          tadpole.place(data.index, data.playerid, data.color);
          app.stage.addChild(totalTadpoles[totalTadpoles.length - 1].sprite);
          updatePlayerUI();
          console.log(totalTadpoles);
          checkTadpoleRow();

          if (data.playerid === 0 && isHost) {
            canPlace = false;
          } else if (data.playerid === 0 && !isHost) {
            canPlace = true;
          } else if (data.playerid === 1 && isHost) {
            canPlace = true;
          } else if (data.playerid === 1 && !isHost) {
            canPlace = false;
          }
          break;
        case "placeFrog":
          frog.place(data.index, data.playerid, data.color);
          app.stage.addChild(totalFrogs[totalFrogs.length - 1].sprite);
          updatePlayerUI();

          if (data.playerid === 0 && isHost) {
            canPlace = false;
          } else if (data.playerid === 0 && !isHost) {
            canPlace = true;
          } else if (data.playerid === 1 && isHost) {
            canPlace = true;
          } else if (data.playerid === 1 && !isHost) {
            canPlace = false;
          }
          break;
      }
    }
  }
}


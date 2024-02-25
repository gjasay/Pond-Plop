import { Text } from "pixi.js";
import { player1, player2 } from "./main";
import { app } from "./app";

let text1Str = "Player " + 1 + "\n" + "Tadpoles: " + 8 + "\nFrogs: " + 0;
let text2Str = "Player " + 2 + "\n" + "Tadpoles: " + 8 + "\nFrogs: " + 0;

const textObj = {
  fontFamily: "Comic Sans MS",
  fontSize: 24,
  fill: 0xfffafa,
  align: "center",
};

let player1Text = new Text(text1Str, textObj);
player1Text.position.x = 10;

let player2Text = new Text(text2Str, textObj);
player2Text.position.x = 645;

export function renderPlayerUI() {
  app.stage.addChild(player1Text);
  app.stage.addChild(player2Text);
}

export function updatePlayerUI() {
  text1Str =
    "Player " +
    player1.playerNumber +
    "\n" +
    "Tadpoles: " +
    player1.tadpolesInHand.length +
    "\nFrogs: " +
    player1.frogsInHand.length;
  text2Str =
    "Player " +
    player2.playerNumber +
    "\n" +
    "Tadpoles: " +
    player2.tadpolesInHand.length +
    "\nFrogs: " +
    player2.frogsInHand.length;

  player1Text.destroy();
  player1Text = new Text(text1Str, textObj);
  player1Text.position.x = 10;

  player2Text.destroy();
  player2Text = new Text(text2Str, textObj);
  player2Text.position.x = 645;

  renderPlayerUI();
}

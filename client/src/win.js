import { app } from "./app";
import { Text } from "pixi.js";
import { createBackground } from "./water";

export let gameOver = false;

export const win = (player) => {

    gameOver = true;

    app.stage.removeChildren();

    createBackground();

    const winText = new Text("Player " + player.playerNumber + " wins!", {
        fontFamily: "Comic Sans MS",
        fontSize: 72,
        fill: 0xffd700,
        align: "center",
    });
    winText.position.x = 180;
    winText.position.y = 65;
    app.stage.addChild(winText);
    
}
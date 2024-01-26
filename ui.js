import { Text } from "pixi.js";
import { app, player1, player2 } from "./main";

let text1Str = 'Player ' + 1 + "\n" + " Tadpoles" + 8
let text2Str = 'Player ' + 2 + "\n" + " Tadpoles" + 8

const textObj = {
    fontFamily: 'Comic Sans MS',
    fontSize: 24,
    fill: 0xff1010,
    align: 'center'
    }

let player1Text = new Text(text1Str, textObj)
player1Text.position.x = 10

let player2Text = new Text(text2Str, textObj)
player2Text.position.x = 580

app.stage.addChild(player1Text)
app.stage.addChild(player2Text)

export function updatePlayerUI() {

    text1Str = 'Player ' + player1.playerNumber + "\n" + " Tadpoles: " + player1.tadpolesInHand
    text2Str = 'Player ' + player2.playerNumber + "\n" + " Tadpoles: " + player2.tadpolesInHand
    
    player1Text.destroy()
    player1Text = new Text(text1Str, textObj)
    player1Text.position.x = 10
    
    player2Text.destroy()
    player2Text = new Text(text2Str, textObj)
    player2Text.position.x = 580
    
    app.stage.addChild(player1Text)
    app.stage.addChild(player2Text)
}
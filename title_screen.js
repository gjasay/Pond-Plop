import { app } from "./app";
import { main } from "./main";
import { renderSprite } from "./my_functions";
import { createBackground } from "./water";
import { ws } from "./websocket"; // Assuming you have a websocket.js file where you initialize your WebSocket connection

// Render title screen
const title = renderSprite({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    texture: "assets/title_screen.png",
});

// Button properties
const playProps = { x: 225, y: 265, width: 346, height: 75, texture: "assets/play_button.png" };
const createGameProps = { x: 115, y: 350, width: 210, height: 170, texture: "assets/create_game_button.png" };
const joinGameProps = { x: 460, y: 370, width: 219, height: 156, texture: "assets/join_game_button.png" };

// Render buttons
const play = renderSprite({
    x: playProps.x,
    y: playProps.y,
    width: playProps.width,
    height: playProps.height,
    texture: playProps.texture,
});

const createGame = renderSprite({
    x: createGameProps.x,
    y: createGameProps.y,
    width: createGameProps.width,
    height: createGameProps.height,
    texture: createGameProps.texture,
});

const joinGame = renderSprite({
    x: joinGameProps.x,
    y: joinGameProps.y,
    width: joinGameProps.width,
    height: joinGameProps.height,
    texture: joinGameProps.texture,
});

// Render water background
createBackground();

// Add title and buttons to stage
app.stage.addChild(title);
app.stage.addChild(play);
app.stage.addChild(createGame);
app.stage.addChild(joinGame);

// Set event mode to static
play.eventMode = 'static';
createGame.eventMode = 'static';
joinGame.eventMode = 'static';

// Add event listeners to play button
play.on("mouseover", () => {
play.width = playProps.width + 5;
    play.height = playProps.height + 5;
    play.x = playProps.x - 5;
    play.y = playProps.y - 5;
    play.cursor = "pointer"
});

play.on("mouseout", () => {
    play.width = playProps.width;
    play.height = playProps.height;
    play.x = playProps.x;
    play.y = playProps.y;
});

play.on("pointerdown", () => {
    play.width = playProps.width - 5;
    play.height = playProps.height - 5;
    play.x = playProps.x + 5;
    play.y = playProps.y + 5;
});

play.on("pointerup", () => {
    play.width = playProps.width;
    play.height = playProps.height;
    play.x = playProps.x;
    play.y = playProps.y;
});

// Add event listeners to create game button
createGame.on("mouseover", () => {
    createGame.width = createGameProps.width + 5;
    createGame.height = createGameProps.height + 5;
    createGame.x = createGameProps.x - 5;
    createGame.y = createGameProps.y - 5;
    createGame.cursor = "pointer"
});

createGame.on("mouseout", () => {
    createGame.width = createGameProps.width;
    createGame.height = createGameProps.height;
    createGame.x = createGameProps.x;
    createGame.y = createGameProps.y;
});

createGame.on("pointerdown", () => {
    createGame.width = createGameProps.width - 5;
    createGame.height = createGameProps.height - 5;
    createGame.x = createGameProps.x + 5;
    createGame.y = createGameProps.y + 5;
});

createGame.on("pointerup", () => {
    createGame.width = createGameProps.width;
    createGame.height = createGameProps.height;
    createGame.x = createGameProps.x;
    createGame.y = createGameProps.y;
});

// Add event listeners to join game button
joinGame.on("mouseover", () => {
    joinGame.width = joinGameProps.width + 5;
    joinGame.height = joinGameProps.height + 5;
    joinGame.x = joinGameProps.x - 5;
    joinGame.y = joinGameProps.y - 5;
    joinGame.cursor = "pointer"
});

joinGame.on("mouseout", () => {
    joinGame.width = joinGameProps.width;
    joinGame.height = joinGameProps.height;
    joinGame.x = joinGameProps.x;
    joinGame.y = joinGameProps.y;
});

joinGame.on("pointerdown", () => {
    joinGame.width = joinGameProps.width - 5;
    joinGame.height = joinGameProps.height - 5;
    joinGame.x = joinGameProps.x + 5;
    joinGame.y = joinGameProps.y + 5;
});

joinGame.on("pointerup", () => {
    joinGame.width = joinGameProps.width;
    joinGame.height = joinGameProps.height;
    joinGame.x = joinGameProps.x;
    joinGame.y = joinGameProps.y;
});

// Add play button functionality
play.on("click", () => {
    main();
});

// Add create game button functionality
createGame.on("click", () => {
    ws.send(JSON.stringify({ type: 'createGame' }));
});

// Add join game button functionality
joinGame.on("click", () => {
    const gameId = prompt('Enter the game ID:');
    if (gameId) {
        ws.send(JSON.stringify({ type: 'joinGame', gameId: gameId }));
    }
});
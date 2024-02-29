import { app } from "./app";
import { main } from "./main";
import { renderSprite } from "./my_functions";
import { createBackground } from "./water";

const title = renderSprite({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    texture: "assets/title_screen.png",
});

const play = renderSprite({
    x: 300,
    y: 230,
    width: 200,
    height: 200,
    texture: "assets/play_button.png",
});

createBackground();

app.stage.addChild(title);
app.stage.addChild(play);

play.eventMode = 'static';

play.on("click", () => {
    main();
});
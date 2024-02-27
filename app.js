import { Application } from "pixi.js";

export let app = new Application({
  width: 800,
  height: 600,
});

app.view.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

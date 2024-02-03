import { lilyPadObjects } from "./lily_pad";
import { totalTadpoles } from "./main";

export class Tadpole {

  place(lilyIndex, player) {
    const newTadpole = player.tadpolesInHand.pop();

    newTadpole.x = lilyPadObjects[lilyIndex].x;
    newTadpole.y = lilyPadObjects[lilyIndex].y;

    totalTadpoles.push({
      sprite: newTadpole,
      texture: player.color[0],
    });
  }
}

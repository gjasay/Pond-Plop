import { player1, player2, totalTadpoles } from "./main";
import { app } from "./app";
import { LilyPad, lilyPadObjects, lilyPadSprites } from "./lily_pad";
import { isTileOccupied, renderSprite } from "./my_functions";

const neighborOffsets = [
  { dx: -36, dy: -36 },
  { dx: -36, dy: 0 },
  { dx: -36, dy: 36 },
  { dx: 0, dy: -36 },
  { dx: 0, dy: 36 },
  { dx: 36, dy: -36 },
  { dx: 36, dy: 0 },
  { dx: 36, dy: 36 },
];
let animating = false;

export default class Check {
  neighbors(player, index) {
    const currentTadpole = totalTadpoles[totalTadpoles.length - 1].sprite;

    for (const neighbor of neighborOffsets) {
      const nx = currentTadpole.x + neighbor.dx;
      const ny = currentTadpole.y + neighbor.dy;

      const neighborIndex = totalTadpoles.findIndex(
        (tadpole) => tadpole.sprite.x === nx && tadpole.sprite.y === ny,
      );

      const newX = nx + nx - currentTadpole.x;
      const newY = ny + ny - currentTadpole.y;

      const isInBounds = newX >= lilyPadObjects[0].x &&
                         newX <= lilyPadObjects[5].x &&
                         newY >= lilyPadObjects[0].y &&
                         newY <= lilyPadObjects[35].y;
      

      if (neighborIndex !== -1 && !isTileOccupied(newX, newY)) {
        const xIncrement =
          newX > totalTadpoles[neighborIndex].sprite.x ? 1 : -1;
        const yIncrement =
          newY > totalTadpoles[neighborIndex].sprite.y ? 1 : -1;

        function animateTadpole(delta) {
          animating = true;
          if (xIncrement !== 0) {
            if (
              (xIncrement === 1 &&
                totalTadpoles[neighborIndex].sprite.x < newX) ||
              (xIncrement === -1 &&
                totalTadpoles[neighborIndex].sprite.x > newX)
              ) {
                totalTadpoles[neighborIndex].sprite.x += xIncrement;
              }
            }

          if (yIncrement !== 0) {
            if (
              (yIncrement === 1 &&
                totalTadpoles[neighborIndex].sprite.y < newY) ||
              (yIncrement === -1 &&
                totalTadpoles[neighborIndex].sprite.y > newY)
              ) {
                totalTadpoles[neighborIndex].sprite.y += yIncrement;
              }
            }
            // Check if the tadpole has reached its target position
          if (
            totalTadpoles[neighborIndex].sprite.x === newX &&
            totalTadpoles[neighborIndex].sprite.y === newY
            ) {
              if (isInBounds) {
                totalTadpoles[neighborIndex].sprite.x = newX;
                totalTadpoles[neighborIndex].sprite.y = newY;
                app.ticker.remove(animateTadpole);
                animating = false;
              } else {
                console.log("Out of bounds!");
                app.ticker.remove(animateTadpole);
                animating = false;
                app.stage.removeChild(totalTadpoles[neighborIndex].sprite);
                totalTadpoles.splice(neighborIndex, 1);

              }
          }
        }
        app.ticker.add(animateTadpole);
        }
      }
  }
}
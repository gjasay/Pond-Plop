import { app } from "./app";
import { lilyPadObjects } from "./lily_pad";
import { totalTadpoles } from "./main";
import { isTileOccupied } from "./my_functions";

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

// Create a queue to store the tadpoles that need to move
const tadpoleQueue = [];

let animating = false;

export class Tadpole {

  place(lilyIndex, player) {
    if (animating) return;
    const newTadpole = player.tadpolesInHand.pop();

    newTadpole.x = lilyPadObjects[lilyIndex].x;
    newTadpole.y = lilyPadObjects[lilyIndex].y;

    totalTadpoles.push({
      sprite: newTadpole,
      texture: player.color[0],
    });

    this.checkNeighbors();
  }

  // This function checks the neighboring tiles around the current tadpole
  checkNeighbors() {
    // Get the last tadpole in the totalTadpoles array
    const currentTadpole = totalTadpoles[totalTadpoles.length - 1].sprite;

    // Iterate over the neighborOffsets array
    for (const neighbor of neighborOffsets) {
      // Calculate the x and y coordinates of the neighboring tile
      const nx = currentTadpole.x + neighbor.dx;
      const ny = currentTadpole.y + neighbor.dy;

      // Find the index of the tadpole that is on the neighboring tile
      const neighborIndex = totalTadpoles.findIndex(
        (tadpole) => tadpole.sprite.x === nx && tadpole.sprite.y === ny,
      );

      // Calculate the new x and y coordinates for the tadpole if it moves to the neighboring tile
      const newX = nx + nx - currentTadpole.x;
      const newY = ny + ny - currentTadpole.y;

      // Check if the new coordinates are within the bounds of the lily pad objects
      const isInBounds = newX >= lilyPadObjects[0].x &&
                         newX <= lilyPadObjects[5].x &&
                         newY >= lilyPadObjects[0].y &&
                         newY <= lilyPadObjects[35].y;
      
      // If there is a tadpole on the neighboring tile and the new tile is not occupied
    if (neighborIndex !== -1 && !isTileOccupied(newX, newY)) {
      // Calculate the increments for the x and y coordinates
      const xIncrement =
        newX > totalTadpoles[neighborIndex].sprite.x ? 1 : -1;
      const yIncrement =
        newY > totalTadpoles[neighborIndex].sprite.y ? 1 : -1;

      // Add the tadpole to the queue
      tadpoleQueue.push({
        tadpole: totalTadpoles[neighborIndex],
        newX,
        newY,
        xIncrement,
        yIncrement,
      });

      // Process the tadpole queue
      processTadpoleQueue();
      }
    }
  }
}

// This function processes the tadpole queue and moves the tadpoles one by one
function processTadpoleQueue() {
  // If there are no tadpoles in the queue or a tadpole is currently animating, return
  if (tadpoleQueue.length === 0 || animating) return;

  // Get the next tadpole from the queue
  const { tadpole, newX, newY, xIncrement, yIncrement } = tadpoleQueue.shift();

  // This function animates the movement of the tadpole
  const animateTadpole = (delta) => {
    animating = true;
    // If the x coordinate needs to be incremented
    if (xIncrement !== 0) {
      // If the tadpole has not reached the new x coordinate
      if (
        (xIncrement === 1 && tadpole.sprite.x < newX) ||
        (xIncrement === -1 && tadpole.sprite.x > newX)
      ) {
        // Increment the x coordinate
        tadpole.sprite.x += xIncrement;
      }
    }

    // If the y coordinate needs to be incremented
    if (yIncrement !== 0) {
      // If the tadpole has not reached the new y coordinate
      if (
        (yIncrement === 1 && tadpole.sprite.y < newY) ||
        (yIncrement === -1 && tadpole.sprite.y > newY)
      ) {
        // Increment the y coordinate
        tadpole.sprite.y += yIncrement;
      }
    }

    // If the tadpole has reached its target position
    if (tadpole.sprite.x === newX && tadpole.sprite.y === newY) {
      // Stop the animation
      app.ticker.remove(animateTadpole);
      animating = false;
    }
  };

  // Start the animation
  app.ticker.add(animateTadpole);
}
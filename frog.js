import { app } from "./app";
import { lilyPadObjects } from "./lily_pad";
import { totalFrogs, totalTadpoles } from "./main";
import { isTileOccupied } from "./my_functions";
import { updatePlayerUI } from "./ui";

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
const frogQueue = [];

let animating = false;

export class Frog {
    place(player, lilyIndex) {
      if (animating) return;
      const newFrog = player.frogsInHand.pop();
  
      newFrog.x = lilyPadObjects[lilyIndex].x;
      newFrog.y = lilyPadObjects[lilyIndex].y;
  
      totalFrogs.push({
        sprite: newFrog,
        texture: player.color[1],
      });
  
      this.checkNeighbors();
    }
   // This function checks the neighboring tiles around the current frog
   checkNeighbors() {
    // Get the last frog in the totalFrogs array
    const currentFrog = totalFrogs[totalFrogs.length - 1].sprite;

    // Iterate over the neighborOffsets array
    for (const neighbor of neighborOffsets) {
      // Calculate the x and y coordinates of the neighboring tile
      const nx = currentFrog.x + neighbor.dx;
      const ny = currentFrog.y + neighbor.dy;

      // Find the index of the frog that is on the neighboring tile
      const neighborIndex = totalFrogs.findIndex(
        (frog) => frog.sprite.x === nx && frog.sprite.y === ny,
      );
        // Find the index of the tadpole that is on the neighboring tile
      const tadpoleIndex = totalTadpoles.findIndex(
        (tadpole) => tadpole.sprite.x === nx && tadpole.sprite.y === ny,
      );

      // Calculate the new x and y coordinates for the frog if it moves to the neighboring tile
      const newX = nx + nx - currentFrog.x;
      const newY = ny + ny - currentFrog.y;

      // If there is a frog or a tadpole on the neighboring tile and the new tile is not occupied
      if ((neighborIndex !== -1 || (tadpoleIndex !== -1 && tadpoleIndex < totalTadpoles.length)) && !isTileOccupied(newX, newY)) {
        // Calculate the increments for the x and y coordinates
        const xIncrement =
          newX > (neighborIndex !== -1 ? totalFrogs[neighborIndex].sprite.x : totalTadpoles[tadpoleIndex].sprite.x) ? 1 : -1;
        const yIncrement =
          newY > (neighborIndex !== -1 ? totalFrogs[neighborIndex].sprite.y : totalTadpoles[tadpoleIndex].sprite.y) ? 1 : -1;
      
        // Add the frog or tadpole to the queue
        frogQueue.push({
          frog: neighborIndex !== -1 ? totalFrogs[neighborIndex] : totalTadpoles[tadpoleIndex],
          newX,
          newY,
          xIncrement,
          yIncrement,
        });
      
        // Process the frog queue
        processFrogQueue();
      }
    }
  }
}

// This function processes the frog queue and moves the frogs one by one
function processFrogQueue() {
  // If there are no frogs in the queue or a frog is currently animating, return
  if (frogQueue.length === 0 || animating) return;

  // Get the next frog from the queue
  const { frog, newX, newY, xIncrement, yIncrement } = frogQueue.shift();

  // This function animates the movement of the frog
  const animateFrog = (delta) => {
    animating = true;
    // If the x coordinate needs to be incremented
    if (xIncrement !== 0) {
      // If the frog has not reached the new x coordinate
      if (
        (xIncrement === 1 && frog.sprite.x < newX) ||
        (xIncrement === -1 && frog.sprite.x > newX)
      ) {
        // Increment the x coordinate
        frog.sprite.x += xIncrement;
      }
    }

    // If the y coordinate needs to be incremented
    if (yIncrement !== 0) {
      // If the frog has not reached the new y coordinate
      if (
        (yIncrement === 1 && frog.sprite.y < newY) ||
        (yIncrement === -1 && frog.sprite.y > newY)
      ) {
        // Increment the y coordinate
        frog.sprite.y += yIncrement;
      }
    }

    // If the frog has reached its target position
    if (frog.sprite.x === newX && frog.sprite.y === newY) {
      // Stop the animation
      app.ticker.remove(animateFrog);
      animating = false;

      // Check if the new coordinates are within the bounds of the lily pad gameboard
      const isInBounds = newX >= lilyPadObjects[0].x &&
                         newX <= lilyPadObjects[5].x &&
                         newY >= lilyPadObjects[0].y &&
                         newY <= lilyPadObjects[35].y;

      // Handle out of bounds state
      if (!isInBounds) {
        // Remove the frog from the gameboard
        frog.sprite.parent.removeChild(frog.sprite);
        // Remove the frog from the totalFrogs array
        totalFrogs.splice(totalFrogs.indexOf(frog), 1);
        // Add a frog back to the player's hand
        if (frog.texture === "assets/frog.png") {
          player2.frogsInHand.push(
            renderSprite({
              width: 32,
              height: 32,
              texture: "assets/frog.png",
            }),
          );
        } else if (frog.texture === "assets/orange_frog.png") {
          player1.frogsInHand.push(
            renderSprite({
              width: 32,
              height: 32,
              texture: "assets/orange_frog.png",
            }),
          );
        }
        // Update the player UI
        updatePlayerUI();
      }
      // Check for three in a row
      // checkForRowFrogsAndTadpoles();
    }
  };

  // Start the animation
  app.ticker.add(animateFrog);
}

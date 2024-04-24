import { app } from "./app";
import { lilyPadSprites } from "./lilypad";
import { PLAYERS, player1, player2, totalTadpoles } from "./main";
import { isTileOccupied, renderSprite } from "./my_functions";

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
const tadpoleQueue = [];

let animating = false;

let queueRunning = false;

let tadpoleArray = [];

function initializeTadpoleArray() {
  tadpoleArray = totalTadpoles
}

// Call initializeTadpoleArray after all modules have been fully loaded
window.addEventListener('load', initializeTadpoleArray);

export class Tadpole {
  place(lilyIndex, playerid, color) {
    if (animating) return;
    const newTadpole = PLAYERS[playerid].tadpolesInHand.pop();

    console.log(lilyIndex)
    newTadpole.x = lilyPadSprites[lilyIndex].x;
    newTadpole.y = lilyPadSprites[lilyIndex].y;

    tadpoleArray.push({
      sprite: newTadpole,
      texture: color,
    });

    this.checkNeighbors();
    if (!queueRunning) {
      checkTadpoleRow();
    }
  }

  // This function checks the neighboring tiles around the current tadpole
  checkNeighbors() {
    // Get the last tadpole in the tadpoleArray array
    const currentTadpole = tadpoleArray[tadpoleArray.length - 1].sprite;

    // Iterate over the neighborOffsets array
    for (const neighbor of neighborOffsets) {
      // Calculate the x and y coordinates of the neighboring tile
      const nx = currentTadpole.x + neighbor.dx;
      const ny = currentTadpole.y + neighbor.dy;

      // Find the index of the tadpole that is on the neighboring tile
      const neighborIndex = tadpoleArray.findIndex(
        (tadpole) => tadpole.sprite.x === nx && tadpole.sprite.y === ny,
      );

      // Calculate the new x and y coordinates for the tadpole if it moves to the neighboring tile
      const newX = nx + nx - currentTadpole.x;
      const newY = ny + ny - currentTadpole.y;

      // If there is a tadpole on the neighboring tile and the new tile is not occupied
      if (neighborIndex !== -1 && !isTileOccupied(newX, newY)) {
        // Calculate the increments for the x and y coordinates
        const xIncrement =
          newX > tadpoleArray[neighborIndex].sprite.x ? 1 : -1;
        const yIncrement =
          newY > tadpoleArray[neighborIndex].sprite.y ? 1 : -1;

        // Add the tadpole to the queue
        tadpoleQueue.push({
          tadpole: tadpoleArray[neighborIndex],
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

  queueRunning = true;

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

      // Check if the new coordinates are within the bounds of the lily pad gameboard
      const isInBounds =
        newX >= lilyPadSprites[0].x &&
        newX <= lilyPadSprites[5].x &&
        newY >= lilyPadSprites[0].y &&
        newY <= lilyPadSprites[35].y;

      // Handle out of bounds state
      if (!isInBounds) {
        // Remove the tadpole from the gameboard
        tadpole.sprite.parent.removeChild(tadpole.sprite);
        // Remove the tadpole from the tadpoleArray array
        tadpoleArray.splice(tadpoleArray.indexOf(tadpole), 1);
        // Add a tadpole back to the player's hand
        if (tadpole.texture === "assets/tadpole.png") {
          player2.tadpolesInHand.push(
            renderSprite({
              width: 32,
              height: 32,
              texture: "assets/tadpole.png",
            }),
          );
        } else if (tadpole.texture === "assets/orange_tadpole.png") {
          player1.tadpolesInHand.push(
            renderSprite({
              width: 32,
              height: 32,
              texture: "assets/orange_tadpole.png",
            }),
          );
        }
        // Update the player UI
        updatePlayerUI();
      }
      // Check for three in a row
      checkTadpoleRow();
      queueRunning = false;
    }
  };

  // Start the animation
  app.ticker.add(animateTadpole);
}

export function checkTadpoleRow() {
  let toRemove = [];

  // Iterate over the tadpoleArray array
  for (let i = 0; i < tadpoleArray.length; i++) {
    const currentTadpole = tadpoleArray[i];
    console.log(tadpoleArray);

    // Iterate over the neighborOffsets array
    for (const offset of neighborOffsets) {
      // Calculate the x and y coordinates of the neighboring tiles
      const nx1 = currentTadpole.sprite.x + offset.dx;
      const ny1 = currentTadpole.sprite.y + offset.dy;
      const nx2 = nx1 + offset.dx;
      const ny2 = ny1 + offset.dy;

      // Find the indices of the tadpoles that are on the neighboring tiles
      const neighborIndex1 = tadpoleArray.findIndex(
        (tadpole) => tadpole.sprite.x === nx1 && tadpole.sprite.y === ny1,
      );
      const neighborIndex2 = tadpoleArray.findIndex(
        (tadpole) => tadpole.sprite.x === nx2 && tadpole.sprite.y === ny2,
      );

      // If there are three tadpoles in a row of the same color
      if (
        neighborIndex1 !== -1 &&
        neighborIndex2 !== -1 &&
        currentTadpole.texture === tadpoleArray[neighborIndex1].texture &&
        tadpoleArray[neighborIndex1].texture ===
          tadpoleArray[neighborIndex2].texture
      ) {
        // Add the indices to the toRemove array
        toRemove.push(i, neighborIndex1, neighborIndex2);
      }
    }
  }

  // Remove duplicates from the toRemove array
  toRemove = [...new Set(toRemove)];

  // Sort the toRemove array in descending order
  toRemove.sort((a, b) => b - a);

  // Remove the tadpoles from the tadpoleArray array
  for (const index of toRemove) {
    const tadpole = tadpoleArray[index];
    console.log(tadpoleArray[index]);

    // Remove the tadpole from the gameboard
    if (tadpole.sprite.parent) {
      tadpole.sprite.parent.removeChild(tadpole.sprite);
    }

    // Add three frogs to the player's hand
    const player = tadpole.texture === "assets/tadpole.png" ? player2 : player1;
    player.frogsInHand.push(
      renderSprite({
        width: 32,
        height: 32,
        texture: player.color[1], // frog texture
      }),
    );

    // Update the player UI
    updatePlayerUI();

    // Remove the tadpole from the tadpoleArray array
    tadpoleArray.splice(index, 1);
  }
}

import { LilyPad, lilyPadObjects } from "./lily_pad";
import { isTileOccupied, renderSprite } from "./my_functions";
import { totalTadpoles } from "./main";

export class Player {
    constructor(color, num) {
        this.playerNumber = num;
        this.tadpoles = [];
        this.maxTadpoles = 8;
        this.tadpolesInHand = 8; 
        this.frogs = [];
        this.maxFrogs = 0;
        this.color = color
    }

    placeTadpole(index) {
        if (this.tadpoles.length < this.maxTadpoles) {
          this.tadpoles.push({
            x: lilyPadObjects[index].x,
            y: lilyPadObjects[index].y,
            width: 32,
            height: 32,
            texture: this.color[0],
            playerNumber: this.playerNumber
          })
        }
      }

    updateTadpole() {
        for (let i = 0; i < this.tadpoles.length; i++) {
          renderSprite(this.tadpoles[i])
        }
    }

    checkNeighbors(index) {
        const currentTadpole = this.tadpoles[index];
      
        const neighbors = [
          { dx: -36, dy: -36 }, { dx: -36, dy: 0 }, { dx: -36, dy: 36 },
          { dx: 0, dy: -36 },                      { dx: 0, dy: 36 },
          { dx: 36, dy: -36 }, { dx: 36, dy: 0 }, { dx: 36, dy: 36 }
        ];
      
        for (const neighbor of neighbors) {
          const nx = currentTadpole.x + neighbor.dx;
          const ny = currentTadpole.y + neighbor.dy;
          
            // Check if there's a tadpole on the neighboring coordinates
      
            const neighborIndex = totalTadpoles.findIndex(tadpole => tadpole.x === nx && tadpole.y === ny);
            const newX = nx + nx - currentTadpole.x;
            const newY = ny + ny - currentTadpole.y;
            if (newX >= lilyPadObjects[0].x
                && newX <= lilyPadObjects[5].x + 10
                && newY >= lilyPadObjects[0].y
                && newY <= lilyPadObjects[35].y + 10) {
                  if (neighborIndex !== -1 
                      && !isTileOccupied(newX, newY)) {
                
                
                    const newLily = new LilyPad(nx, ny)
                    newLily.render()
                
                    totalTadpoles[neighborIndex].x = newX;
                    totalTadpoles[neighborIndex].y = newY;
                }
          } else if (neighborIndex !== -1) {
            
            totalTadpoles.splice(neighborIndex, 1)
            
            const newLily = new LilyPad(nx, ny)
            newLily.render()
            console.log('out of bounds')
          }
        }
      }
}
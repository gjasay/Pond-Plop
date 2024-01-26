export class Tadpole {
    constructor(x, y, color) {
        this.width = 32;
        this.height = 32;
        this.x = x;
        this.y = y;
        this.texture = color
    }
    
    render() {
        renderSprite({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            texture: this.texture
        })
    }

}
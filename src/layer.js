export default class Layer {
    constructor(x, y, width, height, image, speedModifier) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.speedModifier = speedModifier;
    }

    scrollUp() {
        this.y += 1 * this.speedModifier;
    }
    scrollDown() {
        this.y -= 1 * this.speedModifier;
    }
    scrollLeft() {
        this.x += 1 * this.speedModifier;
    }
    scrollRight() {
        this.x-= 1 * this.speedModifier;
    }

    update() {
        // player moving up
        if (this.y >= this.height) {
            this.y = 0;
        }
        // player moving down
        if (this.y <= -this.height) {
            this.y = 0;
        }
        // player moving left
        if (this.x >= this.width) {
            this.x = 0;
        }
        // player moving right
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    draw(context) {
        this.update();
        // top left
        context.drawImage(this.image, this.x - this.width, this.y - this.height, this.width, this.height);
        // top middle
        context.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
        // top right
        context.drawImage(this.image, this.x + this.width, this.y - this.height, this.width, this.height);
        // left
        context.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);
        // center
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        // right
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        // bottom left
        context.drawImage(this.image, this.x - this.width, this.y + this.height, this.width, this.height);
        // bottom
        context.drawImage(this.image, this.x, this.y + this.height, this.width, this.height);
        // bottom right
        context.drawImage(this.image, this.x + this.width, this.y + this.height, this.width, this.height);

    }
}
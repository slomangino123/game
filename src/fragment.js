export default class Fragment {
    constructor(x, y, radius, color, velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: Number.parseFloat(Number.parseFloat(velocity.x).toFixed(2)),
            y: Number.parseFloat(Number.parseFloat(velocity.y).toFixed(2)),
        };
        this.velocity = velocity;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update(context) {
        this.draw(context);
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        if (this.velocity.x == 0 && this.velocity.y == 0) {
            return;
        }
        
        const multiplier = Math.random() * .05;

        const xPositiveDet = Math.sign(this.velocity.x);
        if (xPositiveDet > 0){
            this.velocity.x -= multiplier;
        }
        if (xPositiveDet < 0){
            this.velocity.x += multiplier;
        }

        const yPositiveDet = Math.sign(this.velocity.y);
        if (yPositiveDet > 0){
            this.velocity.y -= multiplier;
        }
        if (yPositiveDet < 0){
            this.velocity.y += multiplier;
        }

        if (this.velocity.x < .05 && this.velocity.x > -.05) {
            this.velocity.x = 0;
        }

        if (this.velocity.y < .05 && this.velocity.y > -.05) {
            this.velocity.y = 0;
        }

        // if (this.velocity.x > 0) {
        //     this.velocity.x = this.ve
        // }
    }
}
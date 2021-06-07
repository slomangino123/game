export default class Fragment {
    constructor(x, y, radius, color, velocity, name)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = { // ??
            x: Number.parseFloat(Number.parseFloat(velocity.x).toFixed(2)),
            y: Number.parseFloat(Number.parseFloat(velocity.y).toFixed(2)),
        };
        this.velocity = velocity;
        this.name = name;
        this.tractorSpeed = 1;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    distanceToCoordinates(x, y) {
    }

    update(context, player) {
        this.draw(context);
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        if (this.isTractored) {
            // speed up the tractor speed
            this.tractorSpeed = this.tractorSpeed + .2;
            // get angle to player
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            const velocity = {
                x: Math.cos(angle) * this.tractorSpeed,
                y: Math.sin(angle) * this.tractorSpeed,
            }

            this.velocity = velocity;

            return;
        }

        const distance = Math.hypot(this.x - player.x, this.y - player.y);
        if (distance < 100) {
            // zoom to player
            this.isTractored = true;// get angle to player
            const angle = Math.atan2(player.y - this.y, player.x - this.x);
            const velocity = {
                x: Math.cos(angle) * this.tractorSpeed,
                y: Math.sin(angle) * this.tractorSpeed,
            }

            this.velocity = velocity;
        }

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
    }
}
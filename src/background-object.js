
// same as above but as floats.
const rand = (min, max = min + (min = 0)) => Math.random() * (max - min) + min;

export default class BackgroundObject {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#ccc';
        this.colorChangeRate = 100;
        this.count = 0;
        this.red = 1-(rand(1) * rand(1) *rand(1));  // reduces colour channels
        this.green = 1-(rand(1) * rand(1) *rand(1)); // but only by a very small amount
        this.blue = 1-(rand(1) * rand(1) *rand(1)); // most of the time but occasional 
                                                    // star will have a distinct colour
        this.spikes = (Math.round(Math.random() * 6)) + 3;
    }

    getScreenX(parentChunk) {
        return this.x + parentChunk.x;
    }

    getScreenY(parentChunk) {
        return this.y + parentChunk.y;
    }

    draw(context, parentChunk) {
        if (this.count % this.colorChangeRate === 0) { // change colour ?
            // colour is a gaussian distrabution (NOT random) centered at #888
            var c = (Math.random() + Math.random() + Math.random() + Math.random()) * 4;
            var str = "#";
            str += Math.floor(c * this.red).toString(16); // change color
            str += Math.floor(c * this.green).toString(16); // change color
            str += Math.floor(c * this.blue).toString(16); // change color
            

            this.col = str;
        }
        this.count += 1; // integer counter used to triger color change every 16 frames
        context.fillStyle = this.col;
        // move star around  a pixel. Again its not random
        // but a gaussian distrabution. The movement is sub pixel and will only
        // make the stars brightness vary not look like its moving
        var ox = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
        var oy = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
        // context.fillRect(this.x + ox, this.y + oy, this.radius, this.radius);

        var rot = Math.PI / 2 * 3;
        var x = this.getScreenX(parentChunk);
        var y = this.getScreenY(parentChunk);
        var step = Math.PI / this.spikes;
        var outerRadius = this.radius + 1;
        var innerRadius = this.radius;

        context.strokeSyle = "#000";
        context.beginPath();
        context.moveTo(this.getScreenX(parentChunk), this.getScreenY(parentChunk) - outerRadius)
        for (let i = 0; i < this.spikes; i++) {
            x = this.getScreenX(parentChunk) + Math.cos(rot) * outerRadius;
            y = this.getScreenY(parentChunk) + Math.sin(rot) * outerRadius;
            context.lineTo(x, y)
            rot += step

            x = this.getScreenX(parentChunk) + Math.cos(rot) * innerRadius;
            y = this.getScreenY(parentChunk) + Math.sin(rot) * innerRadius;
            context.lineTo(x, y)
            rot += step
        }
        context.lineTo(this.getScreenX(parentChunk), this.getScreenY(parentChunk) - outerRadius)
        context.closePath();
        // context.lineWidth=5;
        // context.strokeStyle='blue';
        context.stroke();
        context.fillStyle = this.col;
        context.fill();
    }
}
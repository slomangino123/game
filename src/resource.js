export default class Resource {
    static IRON_RADIUS = 10;
    static ironResource(x, y) {
        return new Resource(x, y, Resource.IRON_RADIUS, 'gray');
    }
    
    static BRONZE_RADIUS = 20;
    static bronzeResource(x, y) {
        return new Resource(x, y, Resource.BRONZE_RADIUS, 'brown');
    }

    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}
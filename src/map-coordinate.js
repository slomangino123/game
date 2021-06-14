export default class MapCoord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getKey() {
        return `${this.x},${this.y}`;
    }
}
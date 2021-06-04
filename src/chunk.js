import BackgroundObject from "./background-object";

export default class Chunk {
    // static CHUNK_WIDTH = 101;
    // static CHUNK_HEIGHT = 101;
    static CHUNK_WIDTH = 200;
    static CHUNK_HEIGHT = 200;
    // static CHUNK_WIDTH = 400;
    // static CHUNK_HEIGHT = 400;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.backgroundObjects = [];
        this.populateBackgroundObjects();
    }
    
    populateBackgroundObjects() {
        var numberOfObjects = Math.random() * 15;
        var coordsWithinChunk = this.getRandomCoordinatesWithinChunk();
        for (let i = 0; i < numberOfObjects; i++) {
            const obj = new BackgroundObject(coordsWithinChunk.x, coordsWithinChunk.y, 3, 'white');
            this.backgroundObjects.push(obj);
        }
    }

    getRandomCoordinatesWithinChunk() {
        const x = this.x + (Math.random() * Chunk.CHUNK_WIDTH);
        const y = this.y + (Math.random() * Chunk.CHUNK_HEIGHT);
        return {x: x, y: y};
    }

    coordinatesAreWithinChunk(x, y) {
        const withinX = x >= this.x && x <= (this.x + Chunk.CHUNK_WIDTH);
        const withinY = y >= this.y && y <= (this.y + Chunk.CHUNK_HEIGHT);

        return withinX && withinY;
    }

    draw(context) {
        context.clearRect(this.x, this.y, Chunk.CHUNK_WIDTH, Chunk.CHUNK_HEIGHT);
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, Chunk.CHUNK_WIDTH, Chunk.CHUNK_HEIGHT);
        
        this.backgroundObjects.forEach(obj => {
            obj.draw(context);
        });
    }
}
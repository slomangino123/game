import BackgroundObject from "./background-object";
import Resource from "./resource";

export default class Chunk {
    // static CHUNK_WIDTH = 100;
    // static CHUNK_HEIGHT = 100;
    // static CHUNK_WIDTH = 200;
    // static CHUNK_HEIGHT = 200;
    static CHUNK_WIDTH = 300;
    static CHUNK_HEIGHT = 300;
    // static CHUNK_WIDTH = 400;
    // static CHUNK_HEIGHT = 400;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.backgroundObjects = [];
        this.resources = [];
        this.populateBackgroundObjects();
        this.populateResources();
    }

    populateResources() {
        var chance = Math.random();
        // spawn iron
        if (chance < .1) {
            var coordsWithinChunk = this.getRandomCoordinatesWithinChunk(Resource.IRON_RADIUS);
            const obj = Resource.ironResource(coordsWithinChunk.x, coordsWithinChunk.y);
            this.resources.push(obj);
        }

        // spawn bronze
        if (chance > .5) {
            var coordsWithinChunk = this.getRandomCoordinatesWithinChunk(Resource.BRONZE_RADIUS);
            const resource = Resource.bronzeResource(coordsWithinChunk.x, coordsWithinChunk.y);
            this.resources.push(resource);
        }
    }
    
    populateBackgroundObjects() {
        var numberOfObjects = Math.random() * 20;
        var coordsWithinChunk = this.getRandomCoordinatesWithinChunk(3);
        for (let i = 0; i < numberOfObjects; i++) {
            const obj = new BackgroundObject(coordsWithinChunk.x, coordsWithinChunk.y, Math.random() * 2, 'white');
            this.backgroundObjects.push(obj);
        }
    }

    getRandomCoordinatesWithinChunk(radius) {
        const x = (Math.random() * (((this.x + Chunk.CHUNK_WIDTH) - radius) - (this.x + radius))) + this.x + radius;
        const y = (Math.random() * (((this.y + Chunk.CHUNK_HEIGHT) - radius) - (this.y + radius))) + this.y + radius;

        // const x = this.x + (Math.random() * (Chunk.CHUNK_WIDTH - radius));
        // const y = this.y + (Math.random() * (Chunk.CHUNK_HEIGHT - radius));
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

        this.resources.forEach(obj => {
            obj.draw(context);
        });
    }
}

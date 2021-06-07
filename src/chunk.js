import BackgroundObject from "./background-object";
import Resource from "./resource";

export default class Chunk {
    // static CHUNK_WIDTH = 100;
    // static CHUNK_HEIGHT = 100;
    static CHUNK_WIDTH = 200;
    static CHUNK_HEIGHT = 200;
    // static CHUNK_WIDTH = 300;
    // static CHUNK_HEIGHT = 300;
    // static CHUNK_WIDTH = 400;
    // static CHUNK_HEIGHT = 400;
    // static CHUNK_WIDTH = 10000;
    // static CHUNK_HEIGHT = 10000;

    constructor(x, y, mapX, mapY) {
        this.x = x;
        this.y = y;
        this.mapX = mapX;
        this.mapY = mapY;

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
        if (chance > .95) {
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
        // basically creates an inner radius for the chunk so that nothing can spawn too close to the edge and risk getting cut off
        // when another chunk generates next to the current chunk.
        const x = (Math.random() * (((this.x + Chunk.CHUNK_WIDTH) - radius) - (this.x + radius))) + this.x + radius;
        const y = (Math.random() * (((this.y + Chunk.CHUNK_HEIGHT) - radius) - (this.y + radius))) + this.y + radius;
        return {x: x, y: y};
    }

    coordinatesAreWithinChunk(x, y) {
        const withinX = x >= this.x && x <= (this.x + Chunk.CHUNK_WIDTH);
        const withinY = y >= this.y && y <= (this.y + Chunk.CHUNK_HEIGHT);
        return withinX && withinY;
    }

    detectProjectileResourceCollisions(projectiles) {
        const resourcesCopy = [...this.resources];
        const projectilesCopy = [...projectiles];
        const fragmentsToCreate = [];
        for (let i = resourcesCopy.length - 1; i > -1; i--) {
            for (let j = projectilesCopy.length - 1; j > -1; j--) {
                const distance = Math.hypot(projectilesCopy[j].x - resourcesCopy[i].x, projectilesCopy[j].y - resourcesCopy[i].y);
                if (distance - resourcesCopy[i].radius - projectilesCopy[j].radius < 1) {
                    const frag = resourcesCopy[i].mine(projectilesCopy[j].damage);
                    setTimeout(() => {
                        projectiles.splice(j, 1);
                    }, 0);

                    if (frag) {
                        fragmentsToCreate.push(frag);
                    }
                }
            }
        }

        return fragmentsToCreate;
    }

    despawnResourcesWithRadiusZero() {
        const originalResources = [...this.resources];
        for (let i = originalResources.length - 1; i > -1; i--) {
            if (originalResources[i].radius <= 0) {
                setTimeout(() => {
                    this.resources.splice(i, 1);
                }, 0);
            }
        }
    }

    draw(context) {
        context.clearRect(this.x, this.y, Chunk.CHUNK_WIDTH, Chunk.CHUNK_HEIGHT);
        context.fillStyle = 'black';
        context.fillRect(this.x, this.y, Chunk.CHUNK_WIDTH, Chunk.CHUNK_HEIGHT);
        
        this.backgroundObjects.forEach(obj => {
            obj.draw(context);
        });

        this.despawnResourcesWithRadiusZero();
        this.resources.forEach(obj => {
            obj.draw(context);
        });
    }
}

import BackgroundObject from "./background-object";
import Resource from "./resource";

export default class Chunk {
    // static CHUNK_WIDTH = 200;
    // static CHUNK_HEIGHT = 200;
    static CHUNK_WIDTH = 10000;
    static CHUNK_HEIGHT = 10000;

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
            var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(Resource.IRON_RADIUS);
            const obj = Resource.ironResource(coordsWithinChunk.x, coordsWithinChunk.y);
            this.resources.push(obj);
        }

        // spawn bronze
        if (chance > .7) {
            var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(Resource.BRONZE_RADIUS);
            const resource = Resource.bronzeResource(coordsWithinChunk.x, coordsWithinChunk.y);
            this.resources.push(resource);
        }
    }

    getRandomCoordinatesInChunkWithRespectToChunkCoordinates(radius) {
        // basically creates an inner radius for the chunk so that nothing can spawn too close to the edge and risk getting cut off
        // when another chunk generates next to the current chunk.
        const x = (Math.random() * (Chunk.CHUNK_WIDTH - (radius * 2))) + radius;
        const y = (Math.random() * (Chunk.CHUNK_HEIGHT - (radius * 2))) + radius;
        return {x: x, y: y};
    }
    
    populateBackgroundObjects() {
        var numberOfObjects = Chunk.CHUNK_HEIGHT * Chunk.CHUNK_WIDTH * 0;
        console.log(numberOfObjects);
        var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(3);
        for (let i = 0; i < numberOfObjects; i++) {
            const obj = new BackgroundObject(coordsWithinChunk.x, coordsWithinChunk.y, Math.random() * 2, 'white');
            this.backgroundObjects.push(obj);
        }
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
            const currentResource = resourcesCopy[i];
            for (let j = projectilesCopy.length - 1; j > -1; j--) {
                const currentProjectile = projectilesCopy[j];
                const distance = Math.hypot(currentProjectile.x - currentResource.getScreenX(this), currentProjectile.y - currentResource.getScreenY(this));
                if (distance - currentResource.radius - currentProjectile.radius < 1) {
                    const frag = currentResource.mine(currentProjectile.damage, this);
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
        // context.clearRect(this.x, this.y, Chunk.CHUNK_WIDTH, Chunk.CHUNK_HEIGHT);
        // context.fillStyle = 'black';
        // context.fillRect(this.x, this.y, Chunk.CHUNK_WIDTH, Chunk.CHUNK_HEIGHT);
        
        this.backgroundObjects.forEach(obj => {
            obj.draw(context, this);
        });

        this.despawnResourcesWithRadiusZero();
        this.resources.forEach(obj => {
            obj.draw(context, this);
        });
    }
}

import BackgroundObject from "./background-object";
import { DiamondDefender } from "./enemy";
import {Resource, Iron, Bronze, Diamond} from "./resource";

export default class Chunk {
    // static CHUNK_WIDTH = 200;
    // static CHUNK_HEIGHT = 200;

    constructor(x, y, mapX, mapY, chunkWidth, chunkHeight) {
        this.x = x;
        this.y = y;
        this.mapX = mapX;
        this.mapY = mapY;
        this.chunkWidth = chunkWidth;
        this.chunkHeight = chunkHeight;

        this.backgroundObjects = [];
        this.resources = [];
        this.enemies = [];
        this.populateBackgroundObjects();
        this.populateResources();
    }

    populateResources() {
        for (let i = 0; i < 15; i++) {
            var chance = Math.random();

            // spawn iron
            if (chance < .1) {
                var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(Iron.RADIUS);
                const resource = new Iron(coordsWithinChunk.x, coordsWithinChunk.y);
                this.resources.push(resource);
            }
        }

        for (let i = 0; i < 10; i++) {
            var chance = Math.random();

            // spawn bronze
            if (chance > .7) {
                var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(Bronze.RADIUS);
                const resource = new Bronze(coordsWithinChunk.x, coordsWithinChunk.y);
                this.resources.push(resource);
            }
        }

        const diamondChance = Math.random();
        // spawn diamond
        if (diamondChance > 0) {
            var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(Diamond.RADIUS);
            const resource = new Diamond(coordsWithinChunk.x, coordsWithinChunk.y);
            this.resources.push(resource);
            this.spawnDiamondDefender(resource);
        }
    }

    spawnDiamondDefender(diamond) {
        const pointNearDiamond = this.getRandomCoordinatesWithinDistanceToAnotherPoint(diamond.x, diamond.y, 100);
        const diamondDefender = new DiamondDefender(pointNearDiamond.x, pointNearDiamond.y, 20, 'green', 10, diamond, this, 'assets/enemy/enemyRed3.png');
        this.enemies.push(diamondDefender);
    }

    getRandomCoordinatesWithinDistanceToAnotherPoint(x, y, maxDistance) {
        const newX = x + (((Math.random() - .5) * 2) * maxDistance);
        const newY = y + (((Math.random() - .5) * 2) * maxDistance);
        return {x: newX, y: newY};
    }

    getRandomCoordinatesInChunkWithRespectToChunkCoordinates(radius) {
        // basically creates an inner radius for the chunk so that nothing can spawn too close to the edge and risk getting cut off
        // when another chunk generates next to the current chunk.
        const x = (Math.random() * (this.chunkWidth - (radius * 2))) + radius;
        const y = (Math.random() * (this.chunkHeight - (radius * 2))) + radius;
        return {x: x, y: y};
    }
    
    populateBackgroundObjects() {
        var numberOfObjects = this.chunkHeight * this.chunkWidth * 0;
        var coordsWithinChunk = this.getRandomCoordinatesInChunkWithRespectToChunkCoordinates(3);
        for (let i = 0; i < numberOfObjects; i++) {
            const obj = new BackgroundObject(coordsWithinChunk.x, coordsWithinChunk.y, Math.random() * 2, 'white');
            this.backgroundObjects.push(obj);
        }
    }

    coordinatesAreWithinChunk(x, y) {
        const withinX = x >= this.x && x <= (this.x + this.chunkWidth);
        const withinY = y >= this.y && y <= (this.y + this.chunkHeight);
        return withinX && withinY;
    }

    detectProjectileResourceCollisions(projectiles) {
        const fragmentsToCreate = [];
        for (let i = this.resources.length - 1; i > -1; i--) {
            const currentResource = this.resources[i];
            for (let j = projectiles.length - 1; j > -1; j--) {
                const currentProjectile = projectiles[j];
                const distance = Math.hypot(currentProjectile.x - currentResource.getScreenX(this), currentProjectile.y - currentResource.getScreenY(this));
                if (distance < currentResource.radius + currentProjectile.radius) {
                    const frags = currentResource.mine(currentProjectile.damage, this);
                    setTimeout(() => {
                        projectiles.splice(j, 1);
                    }, 0);

                    if (frags && frags.length > 0) {
                        for (let k = 0; k < frags.length; k++) {
                            fragmentsToCreate.push(frags[k]);                            
                        }
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

    draw(context, player) {
        let enemyProjectiles;
        this.backgroundObjects.forEach(obj => {
            obj.draw_v1(context, this);
        });

        this.despawnResourcesWithRadiusZero();
        this.resources.forEach(obj => {
            obj.update(context, this);
        });

        this.enemies.forEach(enemy => {
            enemyProjectiles = enemy.update(context, this, player);
        });

        return enemyProjectiles;
    }
}

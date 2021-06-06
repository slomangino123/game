import Projectile from "./projectile";
import Player from "./player";
import Chunk from "./chunk";

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
canvas.height = innerHeight; //document.height is obsolete
canvas.width = innerWidth; //document.width is obsolete

function reportWindowSize() {
    canvas.height = innerHeight * 2;
    canvas.width = innerWidth * 2;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

window.onresize = reportWindowSize;


const player = new Player(Math.round(canvas.width / 2), Math.round(canvas.height / 2), 30, 'blue');
const projectiles = [];
const chunks = [];
const fragments = [];

let wInterval;
let aInterval;
let sInterval;
let dInterval;
window.addEventListener("keydown", event => {
    if (event.code === 'KeyW') { //w
        if (!wInterval)
        {
            wInterval = setInterval(() =>
            {
                scrollCanvasUp();
            }, 4)
        }
        return;
    }
    if (event.code === 'KeyA') { //a
        if (!aInterval) {
            aInterval = setInterval(() =>
            {
                scrollCanvasLeft();
            }, 4)
        }
        return;
    }
    if (event.code === 'KeyS') { //s
        if (!sInterval) {
            sInterval = setInterval(() =>
            {
                scrollCanvasDown();
            }, 4)
        }
        return;
    }
    if (event.code === 'KeyD') { //d
        if (!dInterval) {
            dInterval = setInterval(() =>
            {
                scrollCanvasRight();
            }, 4)
        }
        return;
    }
});
window.addEventListener("keyup", event => {
    if (event.code === 'KeyW') { //w
      window.clearInterval(wInterval);
      wInterval = undefined;
    }
    if (event.code === 'KeyA') { //a
        window.clearInterval(aInterval);
        aInterval = undefined;
    }
    if (event.code === 'KeyS') { //s
        window.clearInterval(sInterval);
        sInterval = undefined;
    }
    if (event.code === 'KeyD') { //d
        window.clearInterval(dInterval);
        dInterval = undefined;
    }
});
window.addEventListener('click', event => {
    console.log('fire!');
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4
    }
    projectiles.push(
        new Projectile(
            player.x,
            player.y,
            5,
            'red',
            velocity)
        )
});



function scrollCanvasUp() {
    chunks.forEach(chunk => {
        chunk.y++;
        chunk.backgroundObjects.forEach(obj => {
            obj.y++;
        });
        chunk.resources.forEach(obj => {
            obj.y++;
        });
    });
    projectiles.forEach(projectile => {
        projectile.y++;
    });
    fragments.forEach(fragment => {
        fragment.y++;
    });
}

function scrollCanvasDown() {
    chunks.forEach(chunk => {
        chunk.y--;
        chunk.backgroundObjects.forEach(obj => {
            obj.y--;
        });
        chunk.resources.forEach(obj => {
            obj.y--;
        });
    });
    projectiles.forEach(projectile => {
        projectile.y--;
    });
    fragments.forEach(fragment => {
        fragment.y--;
    });
}

function scrollCanvasLeft() {
    chunks.forEach(chunk => {
        chunk.x++;
        chunk.backgroundObjects.forEach(obj => {
            obj.x++;
        });
        chunk.resources.forEach(obj => {
            obj.x++;
        });
    });
    projectiles.forEach(projectile => {
        projectile.x++;
    });
    fragments.forEach(fragment => {
        fragment.x++;
    });
}

function scrollCanvasRight() {
    chunks.forEach(chunk => {
        chunk.x--;
        chunk.backgroundObjects.forEach(obj => {
            obj.x--;
        });
        chunk.resources.forEach(obj => {
            obj.x--;
        });
    });
    projectiles.forEach(projectile => {
        projectile.x--;
    });
    fragments.forEach(fragment => {
        fragment.x--;
    });
}

function despawnDistantChunks() {
    const originalChunks = [...chunks];
    for (let i = originalChunks.length - 1; i > -1; i--) {
        if (chunks[i].x > (player.x + (Chunk.CHUNK_WIDTH * 3)) || chunks[i].x < (player.x - (Chunk.CHUNK_WIDTH * 3))) {
            setTimeout(() => {
                chunks.splice(i, 1);
            }, 0);
        }

        if (chunks[i].y > (player.y + (Chunk.CHUNK_HEIGHT * 3)) || chunks[i].y < (player.y - (Chunk.CHUNK_HEIGHT * 3))) {
            setTimeout(() => {
                chunks.splice(i, 1);
            }, 0);
        }
    }
}

function despawnProjectilesOutsideChunks() {
    // Copy the original array into a new object
    const originalProjectiles = [...projectiles];

    // loop backwards through the original array, splicing and updating as we go
    for (let i = originalProjectiles.length - 1; i > -1; i--) {
        let withinChunk = false;
        // check every chunk to see if the projectile exists within it
        for (let j = 0; j < chunks.length; j++) {
            withinChunk = chunks[j].coordinatesAreWithinChunk(originalProjectiles[i].x, originalProjectiles[i].y);
            if (withinChunk) {
                break;
            }            
        }

        // projectile was not in a chunk, remove it
        if (!withinChunk) {
            setTimeout(() => {
                projectiles.splice(i, 1);
            }, 0);
        }
    };
}

function despawnFragmentsOutsideChunks() {
    // Copy the original array into a new object
    const originalFragments = [...fragments];

    // loop backwards through the original array, splicing and updating as we go
    for (let i = originalFragments.length - 1; i > -1; i--) {
        let withinChunk = false;
        // check every chunk to see if the projectile exists within it
        for (let j = 0; j < chunks.length; j++) {
            withinChunk = chunks[j].coordinatesAreWithinChunk(originalFragments[i].x, originalFragments[i].y);
            if (withinChunk) {
                break;
            }            
        }

        // projectile was not in a chunk, remove it
        if (!withinChunk) {
            setTimeout(() => {
                fragments.splice(i, 1);
            }, 0);
        }
    };
}


function populateFirstChunk() {
    const coords = {
        x: player.x - (Chunk.CHUNK_WIDTH / 2),
        y: player.y - (Chunk.CHUNK_HEIGHT / 2),
        mapX: 0,
        mapY: 0
    }
    generateChunk(coords);
    // chunks.push(new Chunk(player.x - (Chunk.CHUNK_WIDTH / 2), player.y - (Chunk.CHUNK_HEIGHT / 2), 0, 0));
}

function generateChunk(coords) {
    const chunk = new Chunk(coords.x, coords.y, coords.mapX, coords.mapY);
    console.log(chunk);
    // chunk.draw(context);
    chunks.push(chunk);
}

function populateSurroundingChunks() {
    // get the current chunk, figure out which chunk the player is in
    var currentChunk = getPlayerOccupiedChunk();

    if (!currentChunk) {
        console.log('Could not find current chunk!');
    }

    // determine the coordinates of the surrounding chunks
    const surroundingChunkCoords = [];
    //top left
    surroundingChunkCoords.push(
        {
            x: currentChunk.x - Chunk.CHUNK_WIDTH,
            y: currentChunk.y - Chunk.CHUNK_HEIGHT,
            mapX: currentChunk.mapX - 1,
            mapY: currentChunk.mapY - 1
        });
    //top middle
    surroundingChunkCoords.push(
        {
            x: currentChunk.x,
            y: currentChunk.y - Chunk.CHUNK_HEIGHT,
            mapX: currentChunk.mapX,
            mapY: currentChunk.mapY - 1
        });
    //top right
    surroundingChunkCoords.push(
        {
            x: currentChunk.x + Chunk.CHUNK_WIDTH,
            y: currentChunk.y - Chunk.CHUNK_HEIGHT,
            mapX: currentChunk.mapX + 1,
            mapY: currentChunk.mapY - 1
        });
    // middle left
    surroundingChunkCoords.push(
        {
            x: currentChunk.x - Chunk.CHUNK_WIDTH,
            y: currentChunk.y,
            mapX: currentChunk.mapX - 1,
            mapY: currentChunk.mapY
        });
    // middle right
    surroundingChunkCoords.push(
        {
            x: currentChunk.x + Chunk.CHUNK_WIDTH,
            y: currentChunk.y,
            mapX: currentChunk.mapX + 1,
            mapY: currentChunk.mapY
        });
    // bottom left
    surroundingChunkCoords.push(
        {
            x: currentChunk.x - Chunk.CHUNK_WIDTH,
            y: currentChunk.y + Chunk.CHUNK_HEIGHT,
            mapX: currentChunk.mapX - 1,
            mapY: currentChunk.mapY + 1
        });
    // bottom middle
    surroundingChunkCoords.push(
        {
            x: currentChunk.x,
            y: currentChunk.y + Chunk.CHUNK_HEIGHT,
            mapX: currentChunk.mapX,
            mapY: currentChunk.mapY + 1
        });
    // bottom right
    surroundingChunkCoords.push(
        {
            x: currentChunk.x + Chunk.CHUNK_WIDTH,
            y: currentChunk.y + Chunk.CHUNK_HEIGHT,
            mapX: currentChunk.mapX + 1,
            mapY: currentChunk.mapY + 1
        });

    // see if those are already generated
    const chunkCoordsToGenerate = [];
    surroundingChunkCoords.forEach(surrChunk => {
        const chunkExists = chunks.find((chunk) => chunk.x == surrChunk.x && chunk.y == surrChunk.y);
        if (chunkExists === undefined)
        {
            chunkCoordsToGenerate.push(surrChunk);
        }
    });

    // generate any that do not exist
    chunkCoordsToGenerate.forEach(chunkCoordinates => {
        generateChunk(chunkCoordinates);
    });
}

function getPlayerOccupiedChunk() {
    var occupiedChunk = chunks.find((chunk) => chunk.coordinatesAreWithinChunk(player.x, player.y));
    return occupiedChunk;
}


function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);

    chunks.forEach(chunk => {
        chunk.draw(context);
        const fragmentsToCreate = chunk.detectProjectileResourceCollisions(projectiles);
        fragmentsToCreate.forEach(fragment => {
            fragments.push(fragment);
        });
    });

    projectiles.forEach(projectile => {
        projectile.update(context);
    });

    fragments.forEach(fragment => {
        fragment.update(context);
    });

    populateSurroundingChunks();
    despawnDistantChunks();
    despawnProjectilesOutsideChunks();
    despawnFragmentsOutsideChunks();

    // Draw player last, so it is always on top
    player.draw(context);
}

populateFirstChunk();
animate();
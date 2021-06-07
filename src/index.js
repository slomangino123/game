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
const savedChunks = [];
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
            savedChunks.push(chunks[i]);
            setTimeout(() => {
                chunks.splice(i, 1);
            }, 0);
            continue;
        }

        if (chunks[i].y > (player.y + (Chunk.CHUNK_HEIGHT * 3)) || chunks[i].y < (player.y - (Chunk.CHUNK_HEIGHT * 3))) {
            savedChunks.push(chunks[i]);
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
    };
    generateChunk(coords);
}

function generateChunk(coords) {
    const chunk = new Chunk(coords.x, coords.y, coords.mapX, coords.mapY);
    // console.log(chunk);
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

    // chunk coordinates to generate based on what has already been generated and what exists on the screen
    const chunkCoordsToGenerate = [];

    // List of chunks removed from memory and need to be loaded into the DOM
    const chunksToLoadFromSaved = [];
loop1:
    for (let i = 0; i < surroundingChunkCoords.length; i++) {
        
        // Chunk doesnt exist in saved data, need to generate a chunk with these coords, push the coords
        // into chunkCoordsToGenerate to generate later
        const chunkExistsOnScreen = chunks.find((chunk) => chunk.x == surroundingChunkCoords[i].x && chunk.y == surroundingChunkCoords[i].y);
        if (chunkExistsOnScreen)
        {
            // No need to load, it already exists
            continue;
        }
loop2:
        for (let j = 0; j < savedChunks.length; j++) {
            // Chunk exists in the saved data, remove it from saved data, push it into chunksToLoadFromSaved to load later
            if (savedChunks[j].mapX == surroundingChunkCoords[i].mapX && savedChunks[j].mapY == surroundingChunkCoords[i].mapY) {
                // the screen x and y coords might have changed since it was saved, update them to be correct now.
                const savedChunk = savedChunks[j];
                savedChunk.x = surroundingChunkCoords[i].x;
                savedChunk.y = surroundingChunkCoords[i].y;

                chunksToLoadFromSaved.push(savedChunks[j]);
                console.log(`loading saved chunk: ${savedChunks[j].mapX}, ${savedChunks[j].mapY}`)
                savedChunks.splice(j, 1);
                continue loop1;
            }
        }

        chunkCoordsToGenerate.push(surroundingChunkCoords[i]);
    }

    // generate any that do not exist
    chunkCoordsToGenerate.forEach(chunkCoordinates => {
        generateChunk(chunkCoordinates);
    });

    chunksToLoadFromSaved.forEach(chunk => {
        loadChunk(chunk);
    });
}

function loadChunk(chunk) {
    chunks.push(chunk);
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
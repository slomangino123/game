import Asteroid from "./asteroids";
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
const asteroids = [];
const projectiles = [];
const chunks = [];

function spawnAsteroids()
{
    setInterval(() => {
        if (asteroids.length < 5)
        {
            asteroids.push(new Asteroid(Math.random() * canvas.width, Math.random() * canvas.height, 60, 'red'))
        }
    }, 1000);
}

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
        x: Math.cos(angle),
        y: Math.sin(angle)
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
    // originalChunks.forEach((chunk, index) => {
        // if (chunk.x > (player.x + (Chunk.CHUNK_WIDTH * 4)) || chunk.x < (player.x - (Chunk.CHUNK_WIDTH * 4))) {
            // setTimeout(() => {
            //     console.log(`player coords: ${player.x}, ${player.y}`);
            //     console.log(`chunk coords: ${chunk.x}, ${chunk.y}`)
            //     chunks.splice(index, 1);
            // }, 0);
        // }
        //  return (chunk.x > (player.x + (Chunk.CHUNK_WIDTH * 4)) || chunk.x < (player.x - (Chunk.CHUNK_WIDTH * 4)));
    // });
}


function populateFirstChunk() {
    chunks.push(new Chunk(player.x - (Chunk.CHUNK_WIDTH / 2), player.y - (Chunk.CHUNK_HEIGHT / 2)));
}

function generateChunk(coords) {
    const chunk = new Chunk(coords.x, coords.y);
    // chunk.draw(context);
    chunks.push(chunk);
}

function populateSurroundingChunks() {
    // get the current chunk, figure out which chunk the player is in
    var currentChunk = getPlayerOccupiedChunk();

    // determine the coordinates of the surrounding chunks
    const surroundingChunkCoords = [];
    //top left
    surroundingChunkCoords.push({x: currentChunk.x - Chunk.CHUNK_WIDTH, y: currentChunk.y - Chunk.CHUNK_HEIGHT});
    //top middle
    surroundingChunkCoords.push({x: currentChunk.x, y: currentChunk.y - Chunk.CHUNK_HEIGHT});
    //top right
    surroundingChunkCoords.push({x: currentChunk.x + Chunk.CHUNK_WIDTH, y: currentChunk.y - Chunk.CHUNK_HEIGHT});
    // middle left
    surroundingChunkCoords.push({x: currentChunk.x - Chunk.CHUNK_WIDTH, y: currentChunk.y});
    // middle right
    surroundingChunkCoords.push({x: currentChunk.x + Chunk.CHUNK_WIDTH, y: currentChunk.y});
    // bottom left
    surroundingChunkCoords.push({x: currentChunk.x - Chunk.CHUNK_WIDTH, y: currentChunk.y + Chunk.CHUNK_HEIGHT});
    // bottom middle
    surroundingChunkCoords.push({x: currentChunk.x, y: currentChunk.y + Chunk.CHUNK_HEIGHT});
    // bottom right
    surroundingChunkCoords.push({x: currentChunk.x + Chunk.CHUNK_WIDTH, y: currentChunk.y + Chunk.CHUNK_HEIGHT});

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
    });

    player.draw(context);

    projectiles.forEach(projectile => {
        projectile.update(context);
    });

    populateSurroundingChunks();
    despawnDistantChunks();
}

populateFirstChunk();
animate();
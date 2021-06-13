import Projectile from "./projectile";
import Player from "./player";
import Chunk from "./chunk";
import Layer from "./layer";
import ShopManager from "./shop-manager";



window.onload = function() {
    let gamePaused = false;
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    canvas.height = innerHeight; //document.height is obsolete
    canvas.width = innerWidth; //document.width is obsolete
    
    const CHUNK_HEIGHT = canvas.height;
    const CHUNK_WIDTH = canvas.width;
    
    function reportWindowSize() {
        canvas.height = innerHeight;
        canvas.width = innerWidth;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // TODO: move objects to compensate?
    }
    
    window.onresize = reportWindowSize;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', event => {
        mouseX = event.x;
        mouseY = event.y;
    });
    
    const inventoryElement = document.getElementById('inventory');
    const shopElement = document.getElementById('shop');
    const bronzeCountElement = document.getElementById('bronze-count');
    const ironCountElement = document.getElementById('iron-count');

    const inventoryElements = [];
    inventoryElements.push(
        {
            itemName: 'bronze',
            element: bronzeCountElement
        },
        {
            itemName: 'iron',
            element: ironCountElement
        }
    )
    
    const player = new Player(Math.round(canvas.width / 2), Math.round(canvas.height / 2), 30, 'blue');
    const projectiles = [];
    const chunks = [];
    const savedChunks = [];
    const fragments = [];
    const shopManager = new ShopManager(player);

    
    let isScrollingUp = false;
    let isScrollingDown = false;
    let isScrollingLeft = false;
    let isScrollingRight = false;

    const backgroundImage1 = new Image();
    backgroundImage1.src = 'stars.png';
    const backgroundLayer1 = new Layer(0, 0, canvas.width, canvas.height, backgroundImage1, .2);
    
    let wInterval;
    let aInterval;
    let sInterval;
    let dInterval;

    function performAction(callback) {
        if (gamePaused === true) {
            return;
        }
        callback();
    }

    window.addEventListener("keydown", event => {
        if (event.code === 'KeyW') { //w
            performAction(() => {
                if (!wInterval)
                {
                    wInterval = setInterval(() =>
                    {
                        scrollCanvasUp();
                    }, 4)
                }
            });
            return;
        }
        if (event.code === 'KeyA') { //a
            performAction(() => {
                if (!aInterval) {
                    aInterval = setInterval(() =>
                    {
                        scrollCanvasLeft();
                    }, 4)
                }
            });
            return;
        }
        if (event.code === 'KeyS') { //s
            performAction(() => {
                if (!sInterval) {
                    sInterval = setInterval(() =>
                    {
                        scrollCanvasDown();
                    }, 4)
                }
            });
            return;
        }
        if (event.code === 'KeyD') { //d
            performAction(() => {
                if (!dInterval) {
                    dInterval = setInterval(() =>
                    {
                        scrollCanvasRight();
                    }, 4)
                }
            });
            return;
        }
        if (event.code === 'KeyE') { //e show inventory
            if (!inventoryElement.style.visibility || inventoryElement.style.visibility === 'hidden') {
                inventoryElement.style.visibility = 'visible';
            } else {
                inventoryElement.style.visibility = 'hidden';
            }
        }
        if (event.code === 'KeyQ') { //e show inventory
            gamePaused = !gamePaused;
            if (gamePaused === true) {
                cancelAnimationFrame(animationFrameId);
                pauseAllActions();
            } else {
                animate();
            }
            if (!shopElement.style.visibility || shopElement.style.visibility === 'hidden') {
                shopElement.style.visibility = 'visible';
            } else {
                shopElement.style.visibility = 'hidden';
            }
        }
    });
    function stopScrollingUp() {
        window.clearInterval(wInterval);
        wInterval = undefined;
        isScrollingUp = false;
    }
    function stopScrollingDown() {
        window.clearInterval(sInterval);
        sInterval = undefined;
        isScrollingDown = false;
        
    }
    function stopScrollingLeft() {
        window.clearInterval(aInterval);
        aInterval = undefined;
        isScrollingLeft = false;
        
    }
    function stopScrollingRight() {
        window.clearInterval(dInterval);
        dInterval = undefined;
        isScrollingRight = false;
        
    }
    function pauseAllActions() {
        stopScrollingUp();
        stopScrollingDown();
        stopScrollingLeft();
        stopScrollingRight();
        
        clearInterval(fireInterval);

    }
    window.addEventListener("keyup", event => {
        if (event.code === 'KeyW') { //w
            stopScrollingUp();
        }
        if (event.code === 'KeyS') { //s
            stopScrollingDown();
        }
        if (event.code === 'KeyA') { //a
            stopScrollingLeft();
        }
        if (event.code === 'KeyD') { //d
            stopScrollingRight();
        }
    });
    function fireProjectile() {
        const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
        console.log(`Fire! ${angle}`);

        const speedMultiplier = 10;
    
        const velocity = {
            x: Math.cos(angle) * speedMultiplier,
            y: Math.sin(angle) * speedMultiplier,
        }
    
        if (isScrollingUp) {
            velocity.y -= 1;
        }
        if (isScrollingDown) {
            velocity.y += 1;
        }
        if (isScrollingLeft) {
            velocity.x -= 1;
        }
        if (isScrollingRight) {
            velocity.x += 1
        }

        const x = Math.cos(angle) * 20;
        const y = Math.sin(angle) * 20;
    
        projectiles.push(
            new Projectile(
                player.x + x,
                player.y + y,
                5,
                'red',
                velocity,
                player.stats.weaponDamage))
    }
    let fireInterval = undefined;
    window.addEventListener('mousedown', event => {
        performAction(() => {
            fireInterval = setInterval(() =>
            {
                fireProjectile(event);
            }, player.getTrueWeaponSpeed())
        });
    });
    window.addEventListener('mouseup', event => {
        clearInterval(fireInterval);
    });
    
    window.addEventListener('click', event => {
        performAction(() => {
            fireProjectile(event);
        });
    });
    
    
    function scrollCanvasUp() {
        backgroundLayer1.scrollUp();
        isScrollingUp = true;
        chunks.forEach(chunk => {
            chunk.y += player.stats.movementSpeed;
        });
        projectiles.forEach(projectile => {
            projectile.y += player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.y += player.stats.movementSpeed;
        });
    }
    
    function scrollCanvasDown() {
        backgroundLayer1.scrollDown();
        isScrollingDown = true;
        chunks.forEach(chunk => {
            chunk.y -= player.stats.movementSpeed;
        });
        projectiles.forEach(projectile => {
            projectile.y -= player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.y -= player.stats.movementSpeed;
        });
    }
    
    function scrollCanvasLeft() {
        backgroundLayer1.scrollLeft();
        isScrollingLeft = true;
        chunks.forEach(chunk => {
            chunk.x += player.stats.movementSpeed;
        });
        projectiles.forEach(projectile => {
            projectile.x += player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.x += player.stats.movementSpeed;
        });
    }
    
    function scrollCanvasRight() {
        backgroundLayer1.scrollRight();
        isScrollingRight = true;
        chunks.forEach(chunk => {
            chunk.x -= player.stats.movementSpeed;
        });
        projectiles.forEach(projectile => {
            projectile.x -= player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.x -= player.stats.movementSpeed;
        });
    }
    
    function despawnDistantChunks() {
        const originalChunks = [...chunks];
        for (let i = originalChunks.length - 1; i > -1; i--) {
            if (chunks[i].x > (player.x + (CHUNK_WIDTH * 3)) || chunks[i].x < (player.x - (CHUNK_WIDTH * 3))) {
                savedChunks.push(chunks[i]);
                setTimeout(() => {
                    chunks.splice(i, 1);
                }, 0);
                continue;
            }
    
            if (chunks[i].y > (player.y + (CHUNK_HEIGHT * 3)) || chunks[i].y < (player.y - (CHUNK_HEIGHT * 3))) {
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
            x: player.x - (CHUNK_WIDTH / 2),
            y: player.y - (CHUNK_HEIGHT / 2),
            mapX: 0,
            mapY: 0
        };
        generateChunk(coords);
    }
    
    function generateChunk(coords) {
        console.log(`Generating Chunk: ${coords.mapX}, ${coords.mapY}`);
        const chunk = new Chunk(coords.x, coords.y, coords.mapX, coords.mapY, CHUNK_WIDTH, CHUNK_HEIGHT);
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
                x: currentChunk.x - CHUNK_WIDTH,
                y: currentChunk.y - CHUNK_HEIGHT,
                mapX: currentChunk.mapX - 1,
                mapY: currentChunk.mapY - 1
            });
        //top middle
        surroundingChunkCoords.push(
            {
                x: currentChunk.x,
                y: currentChunk.y - CHUNK_HEIGHT,
                mapX: currentChunk.mapX,
                mapY: currentChunk.mapY - 1
            });
        //top right
        surroundingChunkCoords.push(
            {
                x: currentChunk.x + CHUNK_WIDTH,
                y: currentChunk.y - CHUNK_HEIGHT,
                mapX: currentChunk.mapX + 1,
                mapY: currentChunk.mapY - 1
            });
        // middle left
        surroundingChunkCoords.push(
            {
                x: currentChunk.x - CHUNK_WIDTH,
                y: currentChunk.y,
                mapX: currentChunk.mapX - 1,
                mapY: currentChunk.mapY
            });
        // middle right
        surroundingChunkCoords.push(
            {
                x: currentChunk.x + CHUNK_WIDTH,
                y: currentChunk.y,
                mapX: currentChunk.mapX + 1,
                mapY: currentChunk.mapY
            });
        // bottom left
        surroundingChunkCoords.push(
            {
                x: currentChunk.x - CHUNK_WIDTH,
                y: currentChunk.y + CHUNK_HEIGHT,
                mapX: currentChunk.mapX - 1,
                mapY: currentChunk.mapY + 1
            });
        // bottom middle
        surroundingChunkCoords.push(
            {
                x: currentChunk.x,
                y: currentChunk.y + CHUNK_HEIGHT,
                mapX: currentChunk.mapX,
                mapY: currentChunk.mapY + 1
            });
        // bottom right
        surroundingChunkCoords.push(
            {
                x: currentChunk.x + CHUNK_WIDTH,
                y: currentChunk.y + CHUNK_HEIGHT,
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
                    // console.log(`loading saved chunk: ${savedChunks[j].mapX}, ${savedChunks[j].mapY}`)
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
        console.log(`Loading Chunk: ${chunk.mapX}, ${chunk.mapY}`)
        chunks.push(chunk);
    }
    
    function getPlayerOccupiedChunk() {
        var occupiedChunk = chunks.find((chunk) => chunk.coordinatesAreWithinChunk(player.x, player.y));
        return occupiedChunk;
    }
    
    function collectNearbyFragments() {
        for (let i = fragments.length - 1; i > -1; i--) {
            const fragment = fragments[i];
            const distanceToPlayer = Math.hypot(fragment.x - player.x, fragment.y - player.y);
            if (distanceToPlayer < 10) {
                player.collectFragment(fragment, inventoryElements);
                
                setTimeout(() => {
                    fragments.splice(i, 1);
                }, 0);
            }
        }
    }
    let animationFrameId;
    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle= 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw Background
        backgroundLayer1.draw(context);

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
            fragment.update(context, player);
        });
    
        populateSurroundingChunks();
        despawnDistantChunks();
        despawnProjectilesOutsideChunks();
        despawnFragmentsOutsideChunks();
        collectNearbyFragments();
    
        // Draw player last, so it is always on top
        player.draw(context, mouseX, mouseY);
        animationFrameId = requestAnimationFrame(animate);
    }
    
    populateFirstChunk();
    animate();
};
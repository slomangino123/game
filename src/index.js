import Projectile from "./projectile";
import Player from "./player";
import Chunk from "./chunk";
import Layer from "./layer";
import ShopManager from "./shop-manager";
import MapCoord from "./map-coordinate";



window.onload = function() {
    let gamePaused = false;
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    canvas.height = innerHeight; //document.height is obsolete
    canvas.width = innerWidth; //document.width is obsolete
    
    const CHUNK_HEIGHT = canvas.height;
    const CHUNK_WIDTH = canvas.width;
    // const CHUNK_HEIGHT = 200;
    // const CHUNK_WIDTH = 200;
    
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
    const chunks_v2 = new Map();
    const savedChunks = [];
    const savedChunks_v2 = new Map();
    const fragments = [];
    const shopManager = new ShopManager(player);
    const enemyProjectiles = [];

    
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
        for (let chunk of chunks_v2.values()) {
            chunk.y += player.stats.movementSpeed;
        }
        projectiles.forEach(projectile => {
            projectile.y += player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.y += player.stats.movementSpeed;
        });
        enemyProjectiles.forEach(proj => {
            proj.y += player.stats.movementSpeed;
        });
    }
    
    function scrollCanvasDown() {
        backgroundLayer1.scrollDown();
        isScrollingDown = true;
        for (let chunk of chunks_v2.values()) {
            chunk.y -= player.stats.movementSpeed;
        }
        projectiles.forEach(projectile => {
            projectile.y -= player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.y -= player.stats.movementSpeed;
        });
        enemyProjectiles.forEach(proj => {
            proj.y -= player.stats.movementSpeed;
        });
    }
    
    function scrollCanvasLeft() {
        backgroundLayer1.scrollLeft();
        isScrollingLeft = true;
        for (let chunk of chunks_v2.values()) {
            chunk.x += player.stats.movementSpeed;
        }
        projectiles.forEach(projectile => {
            projectile.x += player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.x += player.stats.movementSpeed;
        });
        enemyProjectiles.forEach(proj => {
            proj.x += player.stats.movementSpeed;
        });
    }
    
    function scrollCanvasRight() {
        backgroundLayer1.scrollRight();
        isScrollingRight = true;
        for (let chunk of chunks_v2.values()) {
            chunk.x -= player.stats.movementSpeed;
        }
        projectiles.forEach(projectile => {
            projectile.x -= player.stats.movementSpeed;
        });
        fragments.forEach(fragment => {
            fragment.x -= player.stats.movementSpeed;
        });
        enemyProjectiles.forEach(proj => {
            proj.x -= player.stats.movementSpeed;
        });
    }
    
    function despawnDistantChunks() {
        for (let [key, chunk] of chunks_v2) {
            if (chunk.x > (player.x + (CHUNK_WIDTH * 3)) || chunk.x < (player.x - (CHUNK_WIDTH * 3))) {
                setTimeout(() => {
                    chunks_v2.delete(key);
                }, 0); 
            }
    
            if (chunk.y > (player.y + (CHUNK_HEIGHT * 3)) || chunk.y < (player.y - (CHUNK_HEIGHT * 3))) {
                setTimeout(() => {
                    chunks_v2.delete(key);
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
            for (let chunk of chunks_v2.values()) {
                withinChunk = chunk.coordinatesAreWithinChunk(originalProjectiles[i].x, originalProjectiles[i].y);
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
            for (let chunk of chunks_v2.values()) {
                withinChunk = chunk.coordinatesAreWithinChunk(originalFragments[i].x, originalFragments[i].y);
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
            mapY: 0,
            mapCoord: new MapCoord(0, 0)
        };
        generateChunk(coords);
    }
    
    function generateChunk(coords) {
        console.log(`Generating Chunk: ${coords.mapCoord.x}, ${coords.mapCoord.y}`);
        const chunk = new Chunk(coords.x, coords.y, coords.mapCoord.x, coords.mapCoord.y, CHUNK_WIDTH, CHUNK_HEIGHT);
        const mapCoordKey = coords.mapCoord.getKey();
        chunks_v2.set(mapCoordKey, chunk);
        savedChunks_v2.set(mapCoordKey, chunk);
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
                mapCoord: new MapCoord(currentChunk.mapX - 1, currentChunk.mapY - 1)
            });
        //top middle
        surroundingChunkCoords.push(
            {
                x: currentChunk.x,
                y: currentChunk.y - CHUNK_HEIGHT,
                mapCoord: new MapCoord(currentChunk.mapX, currentChunk.mapY - 1)
            });
        //top right
        surroundingChunkCoords.push(
            {
                x: currentChunk.x + CHUNK_WIDTH,
                y: currentChunk.y - CHUNK_HEIGHT,
                mapCoord: new MapCoord(currentChunk.mapX + 1, currentChunk.mapY - 1)
            });
        // middle left
        surroundingChunkCoords.push(
            {
                x: currentChunk.x - CHUNK_WIDTH,
                y: currentChunk.y,
                mapCoord: new MapCoord(currentChunk.mapX - 1, currentChunk.mapY)
            });
        // middle right
        surroundingChunkCoords.push(
            {
                x: currentChunk.x + CHUNK_WIDTH,
                y: currentChunk.y,
                mapCoord: new MapCoord(currentChunk.mapX + 1, currentChunk.mapY)
            });
        // bottom left
        surroundingChunkCoords.push(
            {
                x: currentChunk.x - CHUNK_WIDTH,
                y: currentChunk.y + CHUNK_HEIGHT,
                mapCoord: new MapCoord(currentChunk.mapX - 1, currentChunk.mapY + 1)
            });
        // bottom middle
        surroundingChunkCoords.push(
            {
                x: currentChunk.x,
                y: currentChunk.y + CHUNK_HEIGHT,
                mapCoord: new MapCoord(currentChunk.mapX, currentChunk.mapY + 1)
            });
        // bottom right
        surroundingChunkCoords.push(
            {
                x: currentChunk.x + CHUNK_WIDTH,
                y: currentChunk.y + CHUNK_HEIGHT,
                mapCoord: new MapCoord(currentChunk.mapX + 1, currentChunk.mapY + 1)
            });

        for (let i = 0; i < surroundingChunkCoords.length; i++) {
            const mapCoordKey = surroundingChunkCoords[i].mapCoord.getKey();

            // Check to see if chunk already exists loaded chunks, if so, no need to load or generate
            const chunkExistsOnScreen = chunks_v2.has(mapCoordKey);
            if (chunkExistsOnScreen)
            {
                // No need to load, it already exists
                continue;
            }

            
            // See if chunk was saved
            var savedChunk = savedChunks_v2.get(mapCoordKey)
            if (savedChunk) { // Chunk was saved
                // Update the chunks on-screen coordinates
                savedChunk.x = surroundingChunkCoords[i].x;
                savedChunk.y = surroundingChunkCoords[i].y;

                // load the chunk
                chunks_v2.set(mapCoordKey, savedChunk);
                continue;
            }

            // Generate a new chunk, it was not previously saved.
            generateChunk(surroundingChunkCoords[i]);
        }
    }
    
    function getPlayerOccupiedChunk() {
        for (let chunk of chunks_v2.values()) {
            if (chunk.coordinatesAreWithinChunk(player.x, player.y))
            {
                return chunk;
            }
        }
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

        for (let [key, chunk] of chunks_v2) {
            const fragmentsToCreate = chunk.detectProjectileResourceCollisions(projectiles);
            fragmentsToCreate.forEach(fragment => {
                fragments.push(fragment);
            });
            const enemyProj = chunk.draw(context, player);
            enemyProj.forEach(proj => {
                enemyProjectiles.push(proj);
            });
        }

        enemyProjectiles.forEach(projectile => {
            projectile.update(context);
        })
    
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
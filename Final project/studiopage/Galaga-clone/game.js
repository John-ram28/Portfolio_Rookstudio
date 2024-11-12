// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player setup
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 20,
    color: 'red',
    speed: 5,
    dx: 0
};

// Block setup
const rows = 4;
const cols = 5;
const blockWidth = 60;
const blockHeight = 30;
const blockGap = 10;
const blueBlocks = [];
const greenBlocks = [];
const rowDirections = [1, -1, 1, -1]; // Alternating directions for each row
const rowSpeeds = [1.5, 2, 2.5, 3]; // Different speeds for each row
const greenRowDirections = [1, -1, 1, -1]; // Alternating directions for green blocks
const greenRowSpeeds = [3, 3.5, 4, 4.5]; // Faster speeds for green blocks
const purpleInterval = 60000; // 60 seconds for purple blocks to appear
const intervalTime = 30000; // 30 seconds for block bullets in level 1

// Bullet setup
const playerBullets = [];
const blockBullets = [];
const bulletSpeed = 4;
let purpleBlocks = []; // Two purple blocks in level 2
let level = 1; // Start at level 1
let canShoot = true; // To prevent continuous shooting when spacebar is held down

// Create blue blocks
function createBlueBlocks() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            blueBlocks.push({
                x: 100 + col * (blockWidth + blockGap),
                y: 50 + row * (blockHeight + blockGap),
                width: blockWidth,
                height: blockHeight,
                rowIndex: row // Track row index for alternating directions
            });
        }
    }
}

// Define how many green blocks should be in a row
const greenCols = 10; // Set this to the desired number of green blocks per row

// Create green blocks for level 2
function createGreenBlocks() {
    greenBlocks.length = 0; // Clear any previous green blocks
    const greenBlockWidth = 35; // Slightly smaller
    const greenBlockHeight = 20; // Slightly smaller
    const greenBlockGap = 15; // Spread them further apart
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < greenCols; col++) { // Use greenCols for the number of green blocks in each row
            greenBlocks.push({
                x: 100 + col * (greenBlockWidth + greenBlockGap),
                y: 50 + row * (greenBlockHeight + blockGap),
                width: greenBlockWidth,
                height: greenBlockHeight,
                rowIndex: row // Track row index for alternating directions
            });
        }
    }
}

// Player movement
function movePlayer() {
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw the player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw blue blocks
function drawBlueBlocks() {
    blueBlocks.forEach(block => {
        ctx.fillStyle = 'blue';
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

// Draw green blocks
function drawGreenBlocks() {
    greenBlocks.forEach(block => {
        ctx.fillStyle = 'green';
        ctx.fillRect(block.x, block.y, block.width, block.height);
    });
}

// Draw player bullets
function drawPlayerBullets() {
    playerBullets.forEach(bullet => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Draw block bullets (new function to handle this)
function drawBlockBullets() {
    blockBullets.forEach(bullet => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

// Draw purple blocks
function drawPurpleBlocks() {
    purpleBlocks.forEach(purpleBlock => {
        ctx.fillStyle = purpleBlock.color;
        ctx.fillRect(purpleBlock.x, purpleBlock.y, purpleBlock.width, purpleBlock.height);
    });
}

// Handle key events for player movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') player.dx = -player.speed;
    if (event.key === 'ArrowRight') player.dx = player.speed;
    if (event.key === ' ' && canShoot) { 
        shootPlayerBullet(); // Spacebar to shoot, but only if canShoot is true
        canShoot = false; // Prevent shooting while spacebar is held down
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') player.dx = 0;
    if (event.key === ' ') canShoot = true; // Allow shooting again when spacebar is released
});

// Shoot player bullet
function shootPlayerBullet() {
    if (level === 1 || level === 2) { // Allow shooting in both levels
        playerBullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 5,
            height: 10
        });
    }
}

// Move player bullets
function movePlayerBullets() {
    playerBullets.forEach((bullet, index) => {
        bullet.y -= bulletSpeed;
        if (bullet.y < 0) playerBullets.splice(index, 1);

        // Check for collision with blue or green blocks
        [...blueBlocks, ...greenBlocks].forEach((block, blockIndex) => {
            if (isColliding(bullet, block)) {
                playerBullets.splice(index, 1);
                if (level === 1) {
                    blueBlocks.splice(blockIndex, 1); // Remove hit blue block
                } else if (level === 2) {
                    greenBlocks.splice(blockIndex, 1); // Remove hit green block
                }
            }
        });
    });
}

// Block movement logic
function moveBlueBlocks() {
    blueBlocks.forEach(block => {
        block.x += rowDirections[block.rowIndex] * rowSpeeds[block.rowIndex];
        if (block.x + block.width >= canvas.width || block.x <= 0) {
            rowDirections[block.rowIndex] *= -1;
        }
    });
}

function moveGreenBlocks() {
    greenBlocks.forEach(block => {
        block.x += greenRowDirections[block.rowIndex] * greenRowSpeeds[block.rowIndex];
        if (block.x + block.width >= canvas.width || block.x <= 0) {
            greenRowDirections[block.rowIndex] *= -1;
        }
    });
}

// Move purple blocks (new function to handle movement)
function movePurpleBlocks() {
    purpleBlocks.forEach(purpleBlock => {
        purpleBlock.y += 2; // Speed of purple blocks
        if (purpleBlock.y + purpleBlock.height > canvas.height) {
            purpleBlock.y = 0; // Reset to top once they reach the bottom
            purpleBlock.x = Math.random() * (canvas.width - blockWidth); // Random horizontal position
        }
    });
}

// Define how many bullets the green blocks should shoot at random every interval
const greenBulletCount = 5; // Set this to the number of bullets green blocks shoot at random
// Create block bullets (random shooting every interval)
function createBlockBullet() {
    if (level === 1 && blueBlocks.length > 0) {
        const randomBlock = blueBlocks[Math.floor(Math.random() * blueBlocks.length)];
        blockBullets.push({
            x: randomBlock.x + blockWidth / 2 - 2,
            y: randomBlock.y + blockHeight,
            width: 5,
            height: 10
        });
    }

    if (level === 2 && greenBlocks.length > 0) {
        const randomBlocks = [];
        while (randomBlocks.length < greenBulletCount) {
            const randomBlock = greenBlocks[Math.floor(Math.random() * greenBlocks.length)];
            if (!randomBlocks.includes(randomBlock)) randomBlocks.push(randomBlock);
        }
        randomBlocks.forEach(randomBlock => {
            blockBullets.push({
                x: randomBlock.x + 35 / 2 - 2,
                y: randomBlock.y + 20,
                width: 5,
                height: 10
            });
        });
    }
}

// Move block bullets
function moveBlockBullets() {
    blockBullets.forEach((bullet, index) => {
        bullet.y += bulletSpeed;
        if (bullet.y > canvas.height) blockBullets.splice(index, 1);
        if (isColliding(bullet, player)) {
            alert('Game Over! You were hit by a block bullet.');
            window.location.reload(); // Restart the game
        }
    });
}

// Spawn purple blocks (for level 2)
function spawnPurpleBlocks() {
    purpleBlocks = [
        { x: Math.random() * (canvas.width - 30), y: 0, width: 30, height: 30, color: 'purple' },
        { x: Math.random() * (canvas.width - 30), y: 0, width: 30, height: 30, color: 'purple' }
    ];
}

// Check collision function
function isColliding(bullet, block) {
    return bullet.x < block.x + block.width &&
           bullet.x + bullet.width > block.x &&
           bullet.y < block.y + block.height &&
           bullet.y + bullet.height > block.y;
}

// Update game state
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    movePlayerBullets();
    moveBlockBullets();

    if (level === 1) {
        moveBlueBlocks();
    } else if (level === 2) {
        moveGreenBlocks();
        movePurpleBlocks();
    }

    drawPlayer();
    if (level === 1) drawBlueBlocks();
    else if (level === 2) drawGreenBlocks();

    drawPlayerBullets();
    drawBlockBullets();
    if (level === 2) drawPurpleBlocks();

    // Level up condition: If all blue blocks are gone, transition to level 2
    if (level === 1 && blueBlocks.length === 0) {
        level = 2;
        createGreenBlocks(); // Create green blocks when level 2 starts
        setInterval(spawnPurpleBlocks, purpleInterval);
    }
}

// Main game loop
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game
createBlueBlocks();
gameLoop();
setInterval(createBlockBullet, intervalTime);


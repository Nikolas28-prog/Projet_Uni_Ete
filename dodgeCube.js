// Based somewhat on this article by Spicy Yoghurt
// URL for further reading: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
const app = new PIXI.Application({ backgroundColor: 0x111111 });
document.body.appendChild(app.view);

// Options for how objects interact
// How fast the red square moves
const movementSpeed = 0.05;

// Strength of the impulse push between two objects
const impulsePower = 5;

// Test For Hit
// A basic AABB check between two different squares
function isCollinding(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}


// Calculate the distance between two given points
function distanceBetweenTwoPoints(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;

    return Math.hypot(a, b);
}

// The green square we will knock about
const projectile = new PIXI.Sprite(PIXI.Texture.WHITE);
projectile.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
projectile.width = 100;
projectile.height = 100;
projectile.tint = '0x00FF00';
projectile.acceleration = new PIXI.Point(0);
projectile.mass = 3;

// The square you move around
const redSquare = new PIXI.Sprite(PIXI.Texture.WHITE);
redSquare.position.set(0, 0);
redSquare.width = 100;
redSquare.height = 100;
redSquare.tint = '0xFF0000';
redSquare.acceleration = new PIXI.Point(0);
redSquare.mass = 1;

// Listen for animate update
app.ticker.add((delta) => {
    // Applied deacceleration for both squares, done by reducing the
    // acceleration by 0.01% of the acceleration every loop
    redSquare.acceleration.set(redSquare.acceleration.x * 0.99, redSquare.acceleration.y * 0.99);
    projectile.acceleration.set(projectile.acceleration.x * 0.99, projectile.acceleration.y * 0.99);

    const mouseCoords = app.renderer.plugins.interaction.mouse.global;

    // Check whether the green square ever moves off the screen
    // If so, reverse acceleration in that direction
    if (projectile.x < 0 || projectile.x > (app.screen.width - 100)) {
        projectile.acceleration.x = -projectile.acceleration.x;
    }

    if (projectile.y < 0 || projectile.y > (app.screen.height - 100)) {
        projectile.acceleration.y = -projectile.acceleration.y;
    }

    // If the green square pops out of the cordon, it pops back into the
    // middle
    if ((projectile.x < -30 || projectile.x > (app.screen.width + 30))
        || projectile.y < -30 || projectile.y > (app.screen.height + 30)) {
        projectile.position.set((app.screen.width - 100) / 2, (app.screen.height - 100) / 2);
    }

    // If the mouse is off screen, then don't update any further
    if (app.screen.width > mouseCoords.x || mouseCoords.x > 0
        || app.screen.height > mouseCoords.y || mouseCoords.y > 0) {
        // Get the red square's center point
        const redSquareCenterPosition = new PIXI.Point(
            redSquare.x + (redSquare.width * 0.5),
            redSquare.y + (redSquare.height * 0.5),
        );

        // Calculate the direction vector between the mouse pointer and
        // the red square
        const toMouseDirection = new PIXI.Point(
            mouseCoords.x - redSquareCenterPosition.x,
            mouseCoords.y - redSquareCenterPosition.y,
        );

        // Use the above to figure out the angle that direction has
        const angleToMouse = Math.atan2(
            toMouseDirection.y,
            toMouseDirection.x,
        );

        // Figure out the speed the square should be travelling by, as a
        // function of how far away from the mouse pointer the red square is
        const distMouseRedSquare = distanceBetweenTwoPoints(
            mouseCoords,
            redSquareCenterPosition,
        );
        const redSpeed = distMouseRedSquare * movementSpeed;

        // Calculate the acceleration of the red square
        redSquare.acceleration.set(
            Math.cos(angleToMouse) * redSpeed,
            Math.sin(angleToMouse) * redSpeed,
        );
    }


    projectile.x += projectile.acceleration.x * delta;
    projectile.y += projectile.acceleration.y * delta;

    redSquare.x += redSquare.acceleration.x * delta;
    redSquare.y += redSquare.acceleration.y * delta;

    for(let i=1;i<app.stage.children.length;i++){
        if(isCollinding(redSquare, app.stage.children[i])){
            console.log("collided")
            app.stage.removeChildAt(i)
        }
        
    }
});

// Add to stage
app.stage.addChild(redSquare, projectile);





// Add to stage
app.stage.addChild(redSquare);
for(let i=0;i<3;i++){
app.stage.addChild(projectile);
}

// app.stage.removeChildAt(1)
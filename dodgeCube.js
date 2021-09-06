const app = new PIXI.Application({ backgroundColor: 0x111111 });
document.body.appendChild(app.view);

function isCollinding(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}

const player = new PIXI.Sprite(PIXI.Texture.WHITE);
player.position.set(app.screen.width/2, app.screen.height/2);
player.width = 100;
player.height = 100;
player.tint = '0xFF0000';

let projectiles = []

function update(delta) {

    const mouseCoords = app.renderer.plugins.interaction.mouse.global;


    player.x = mouseCoords.x;
    player.y = mouseCoords.y;

    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].position.x -= projectiles[i].speed;
        if (projectiles[i].position.x < 0) {
            console.log("leaved screen")
            app.stage.removeChild(projectiles[i])
            projectiles.splice(i,1)
        } else if (isCollinding(player, projectiles[i])) {
            console.log("collision")
            app.stage.removeChild(projectiles[i])
            projectiles.splice(i,1)
        }
    }
}

function random(min,max){
    return Math.floor(Math.random() * (max - min)) + min
}

function createProjectile(speed,x,y,direction) {
    let projectile = new PIXI.Sprite(PIXI.Texture.WHITE);

    projectile.position.set(app.screen.width - 100, Math.floor(Math.random() * (app.screen.height - 10)) + 10);
    projectile.width = 10;
    projectile.height = 10;
    projectile.tint = '0x00FF00';
    projectile.speed = speed
    app.stage.addChild(projectile)
    projectiles.push(projectile)

    return projectile
}


// Add to stage
app.stage.addChild(player);
// Listen for animate update
app.ticker.add(update);

setInterval(createProjectile, 1000);
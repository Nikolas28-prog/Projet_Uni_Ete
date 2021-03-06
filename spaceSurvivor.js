const app = new PIXI.Application({ backgroundColor: 0x111111 ,width: 1200, height: 700});
document.body.appendChild(app.view);


function isCollinding(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}

var playing = false;
let projectiles = []
let interval;
var player;
var healthBar;
var health;
var start_time;
var richText;
var welcomeText;
const style = new PIXI.TextStyle({
    fontFamily: 'pokemon',
    fontSize: 36,
    fill: ['#ffffff', '#00ff99'], // gradient
});

function update(delta) {

    if (button && !playing) { //play again
        start()
        button = false;
        playing = true
    }

    

    // const mouseCoords = app.renderer.plugins.interaction.mouse.global;

    // player.x = mouseCoords.x;
    // player.y = mouseCoords.y;
    player.x += y * 10
    player.y += x * 10

    //handle walls
    if (player.x > app.screen.width - 50) {
        player.x = app.screen.width - 50
    } else if (player.x < 50) {
        player.x = 50
    }

    if (player.y > app.screen.height - 50) {
        player.y = app.screen.height - 50
    } else if (player.y < 50) {
        player.y = 50
    }

    for (let i = projectiles.length - 1; i >= 0; i--) {
        if(!playing){
            return
        }
        //update positions
        projectiles[i].position.x -= projectiles[i].speedX;
        projectiles[i].position.y -= projectiles[i].speedY;
        //update destruction
        if (isOutOfScreen(projectiles[i])) {
            if (projectiles[i].bounce) {
                projectiles[i].bounce = false
                //bounce once
                projectiles[i].speedX = -projectiles[i].speedX;
                projectiles[i].speedY = -projectiles[i].speedY
            } else {
                // console.log("leaved screen")
                app.stage.removeChild(projectiles[i])
                projectiles.splice(i, 1)
            }
        } else if (playing && isCollinding(player, projectiles[i])) {
            // console.log("collision")
            if (projectiles[i].heal) {
                addHealth(30)
                player.green += 1
            } else {
                addHealth(-30)
                player.red += 1
            }
            app.stage.removeChild(projectiles[i])
            projectiles.splice(i, 1)
        }
    }

}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function isOutOfScreen(item) {
    return item.position.x > app.screen.width || item.position.x < 0 || item.position.y > app.screen.height || item.position.y < 0
}

function createProjectile() {
    let projectile = new PIXI.Sprite(PIXI.Texture.WHITE);
    let x, y
    switch (random(0, 4)) { //spawn side
        case 0:// top
            x = random(0, app.screen.width)
            y = app.screen.height
            break;
        case 1: // down
            x = random(0, app.screen.width)
            y = 0
            break;
        case 2:// left
            x = 0
            y = random(0, app.screen.height)
            break;
        case 3: // right
            x = app.screen.width
            y = random(0, app.screen.height)
            break;
    }

    projectile.position.set(x, y);
    let a = random(-4, 4);
    let b = random(-4, 4);
    if (Math.abs(a) < 2)
        a = 3
    if (Math.abs(b) < 2)
        b = 3
    projectile.speedX = a
    projectile.speedY = b

    let size;
    if (random(0, 4)) { //damage
        projectile.bounce = true;
        projectile.tint = '0xFF0000';
        size = random(10, 50);
    } else {//heals
        projectile.heal = true
        projectile.tint = '0x00FF00';
        size = random(10, 20);
    }

    projectile.width = size;
    projectile.height = size;

    app.stage.addChild(projectile)
    projectiles.push(projectile)

    return projectile
}




function addHealth(hp) {
    health.width += hp
    if (health.width <= 0) {
        health.width = 0;
        gameOver()
    } else if (health.width > 100) {
        health.width = 100;
    }
}


function format(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}


function start() {
    // console.log("start !")
    healthBar = new PIXI.Container();
    healthBar.position.set(10, 10)


    let border = new PIXI.Graphics();
    border.lineStyle(10, 0xFFFFFF, 1, 1, true);
    border.drawRect(0, 0, 101, 31);
    healthBar.addChild(border);

    health = new PIXI.Graphics();
    health.beginFill(0x00FF00);
    health.drawRect(0, 1, 100, 30);
    health.endFill();
    healthBar.addChild(health);

    healthBar.health = health.width;

    player = new PIXI.Sprite.from("assets/alien.png");
    player.anchor.set(0.5)
    player.position.set(app.screen.width / 2, app.screen.height / 2);
    player.width = 100;
    player.height = 100;
    player.red = 0
    player.green = 0
    // Add to stage
    app.stage.addChild(player);
    // Listen for animate update
    app.ticker.add(update);
    interval = setInterval(createProjectile, 300);
    app.stage.addChild(healthBar);
    start_time = new Date();

    if (richText) {
        app.stage.removeChild(richText)
    }
    if (welcomeText) {
        app.stage.removeChild(welcomeText)
    }
}

function gameOver() {

    playing = false
    app.ticker.remove(update)
    clearInterval(interval)
    
    //remove player,healthbar and projectiles
    while(app.stage.children.length>0){
        app.stage.removeChild(app.stage.children[0]) 
    }
    projectiles = []
    
    //engame stats
    let diff = new Date(new Date() - start_time)
    let m = format(diff.getMinutes())
    let s = format(diff.getSeconds())

    richText = new PIXI.Text('GAME OVER\ntime: ' + m + ":" + s + '\nhits: ' + player.red + '\nheals: ' + player.green + '\npress button to play again', style);
    richText.x = app.screen.width / 2;
    richText.y = app.screen.height / 2;
    richText.anchor.set(0.5)
    app.stage.addChild(richText);

}

welcomeText = new PIXI.Text('Press button to start game', style);
welcomeText.x = app.screen.width / 2;
welcomeText.y = app.screen.height / 2;
welcomeText.anchor.set(0.5)
app.stage.addChild(welcomeText);
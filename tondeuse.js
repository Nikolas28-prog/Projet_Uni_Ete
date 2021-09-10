// based on the exemple scratchCard of pixiJS

var tondeuse;
var renderTexture;
var ended = false;
const app = new PIXI.Application({ width: 600, height: 600 });
document.body.appendChild(app.view);
const { stage } = app;


// prepare rectangle texture, that will be our brush to clean the garden
const brush = new PIXI.Graphics();
brush.beginFill('0xffffff');
brush.drawRect(0, 0, 30, 30);
brush.endFill();

//create 2D array to keep trace of where the TONDEUSE goes.
var width = app.screen.width;
var height = app.screen.height;
// var mapcol = new Array(20).fill(false);
// var map = new Array(20).fill(mapcol);

var map = new Array(20);

for (let i = 0; i < 20; i++) {
    map[i] = new Array(20);
    for (let j = 0; j < 20; j++) {
        map[i][j] = false
    }
}


app.loader.add('t1', '/assets/grass.jpg');
app.loader.add('t2', 'assets/rock.jpg');
app.loader.add('t3', 'assets/tondeuse.png');

app.loader.load(setup);
function setup(loader, resources) {

    //create first plan image 
    const backgfloor = new PIXI.Sprite(resources.t1.texture);
    stage.addChild(backgfloor);
    backgfloor.width = app.screen.width;
    backgfloor.height = app.screen.height;
    //create image to reveal   
    const imageToReveal = new PIXI.Sprite(resources.t2.texture);
    stage.addChild(imageToReveal);
    imageToReveal.width = app.screen.width;
    imageToReveal.height = app.screen.height;
    //create mower img
    tondeuse = new PIXI.Sprite(resources.t3.texture);
    tondeuse.position.set(0, 0);
    tondeuse.width = 30;
    tondeuse.height = 30;
    brush.addChild(tondeuse);
    app.stage.addChild(tondeuse);
    renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
    const renderTextureSprite = new PIXI.Sprite(renderTexture);
    stage.addChild(renderTextureSprite);
    imageToReveal.mask = renderTextureSprite;
    app.stage.interactive = true;
    app.ticker.add(update);
}

function checkTondeusePos(tondeuse) {
    if (tondeuse.y > app.screen.height - 30) tondeuse.y = app.screen.height - 30;
    if (tondeuse.y < 0) tondeuse.y = 0;
    if (tondeuse.x < 0) tondeuse.x = 0;
    if (tondeuse.x > app.screen.width - 30) tondeuse.x = app.screen.width - 30;
}

function isPainted() {
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            if (!map[i][j]) {
                return false
            }
        }
    }
    ended = true;
    return true
}

const mouseCoords = app.renderer.plugins.interaction.mouse.global;

function update() {
    if (ended) {
        ended = false;
        console.log("C'est quand même bien mieux des cailloux non ?");
        // location.reload();
        //app.loader.load(setup);
        //resetArray();
    }
    tondeuse.x = mouseCoords.x;
    tondeuse.y = mouseCoords.y;
    checkTondeusePos(tondeuse); //walls
    brush.x = tondeuse.x;
    brush.y = tondeuse.y;

    fill(tondeuse.x, tondeuse.y)
    app.renderer.render(brush, renderTexture, false, null, false);
}

function fill(x, y) {
    map[Math.floor(Math.floor(x) / 30)][Math.floor(Math.floor(y) / 30)] = true
}

setInterval(isPainted, 500);
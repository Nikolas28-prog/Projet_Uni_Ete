// based on the exemple scratchCard of pixiJS

var tondeuse;
var renderTexture;
var ended = false;
const app = new PIXI.Application({ width: 320, height: 128 });
document.body.appendChild(app.view);
const { stage } = app;
var width = app.screen.width;
var height = app.screen.height;


// prepare rectangle texture, that will be our brush to clean the garden
const brush = new PIXI.Graphics();
brush.beginFill('0xffffff');
brush.drawRect(0, 0, 30, 30);
brush.endFill();


//create 2D array to keep trace of where the TONDEUSE goes.
var map;
function initArray(){
    map =new Array(20);
    
    for (let i = 0; i < 20; i++) {
        map[i] = new Array(20);
        for (let j = 0; j < 20; j++) {
            map[i][j] = false
        }
    }

}
initArray();

//imgs to load
app.loader.add('t1', '/assets/uncut_grass.png');
app.loader.add('t2', 'assets/cutted_grass.png');
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
    //create mower img and child it to the brush
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
//walls
function checkTondeusePos(tondeuse) {
    if (tondeuse.y > app.screen.height - 30) tondeuse.y = app.screen.height - 30;
    if (tondeuse.y < 0) tondeuse.y = 0;
    if (tondeuse.x < 0) tondeuse.x = 0;
    if (tondeuse.x > app.screen.width - 30) tondeuse.x = app.screen.width - 30;
}
//check if the background is fully painted
function isPainted() {
    for (let i = 0; i < Math.floor(width/tondeuse.width); i++) {
        for (let j = 0; j < Math.floor(height/tondeuse.height); j++) {
            if (!map[i][j]) {
                return false
            }
        }
    }
    ended = true;
    return true
}
//line used in tests, to move la tondeuse with mouse
const mouseCoords = app.renderer.plugins.interaction.mouse.global;


function resetGame(){
    initArray();
    ended=false;
    location.reload();


}
function update() {
    if (ended) {//reset game
        alert("Tonte terminée, on recommence ?");
        resetGame();
    }

    tondeuse.x += y*10;
    tondeuse.y += x*10;
    //alternative to move tondeuse with mouse
     tondeuse.x = mouseCoords.x;
     tondeuse.y = mouseCoords.y;
    checkTondeusePos(tondeuse); //walls
    brush.x = tondeuse.x;
    brush.y = tondeuse.y;
    //paint over first image with second image, under our tondeuse obj
    fill(tondeuse.x, tondeuse.y)
    app.renderer.render(brush, renderTexture, false, null, false);
}
//fill our bool 2d arr to keep trace of tondeuse path
function fill(x, y) {
    map[Math.floor(Math.floor(x) / tondeuse.width)][Math.floor(Math.floor(y) / tondeuse.height)] = true
}

setInterval(isPainted, 500);
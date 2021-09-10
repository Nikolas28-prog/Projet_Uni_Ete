// based on the exemple scratchCard of pixiJS

var tondeuse;
var renderTexture;
var ended=false;
const app = new PIXI.Application();
document.body.appendChild(app.view);
const { stage } = app;

// prepare rectangle texture, that will be our brush to clean the garden
const brush = new PIXI.Graphics();
brush.beginFill('0xffffff');
brush.drawRect(0, 0, 35,35);
brush.endFill();

//create 2D array to keep trace of where the TONDEUSE goes.
var width = app.screen.width;
var height = app.screen.height;
var mapcol =new Array(height).fill(false);
var map = new Array(width).fill(mapcol);

app.loader.add('t1', '/assets/grass.jpg');
app.loader.add('t2', 'assets/rock.jpg');
app.loader.add('t3', 'assets/tondeuse.png');

app.loader.load(setup);
function setup(loader, resources) {

//create first plan image 
    const background = new PIXI.Sprite(resources.t1.texture);
    stage.addChild(background);
    background.width = app.screen.width;
    background.height = app.screen.height;
//create image to reveal   
    const imageToReveal = new PIXI.Sprite(resources.t2.texture);
    stage.addChild(imageToReveal);
    imageToReveal.width = app.screen.width;
    imageToReveal.height = app.screen.height;
//create mower img
    tondeuse = new PIXI.Sprite(resources.t3.texture);
    tondeuse.position.set(0,0);
    tondeuse.width=40;
    tondeuse.height=40;
    brush.addChild(tondeuse);
    app.stage.addChild(tondeuse);


    renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);
    
    const renderTextureSprite = new PIXI.Sprite(renderTexture);
    stage.addChild(renderTextureSprite);
    imageToReveal.mask = renderTextureSprite;

    
    app.stage.interactive = true;  
    
    
    app.ticker.add(update);
}

function checkTondeusePos(tondeuse){
    if(tondeuse.y>app.screen.height-37)tondeuse.y=app.screen.height-37;
    if(tondeuse.y<0)tondeuse.y=0;
    if(tondeuse.x<0)tondeuse.x=0;
    if(tondeuse.x>app.screen.width-37)tondeuse.x=app.screen.width-37;
}

function updateWay(){
    for (var i =tondeuse.x;i<tondeuse.x+35;i++){
        for (var j=tondeuse.y;j<tondeuse.y+35;j++){
            map[i][j]=true;
        }
    }
}

function checkEnd(){
    for (var i =0; i<width;i++){
        if(!map[i].includes(false)){
            ended=true;
        }
    }
}

// function  resetArray(){
//     mapcol =new Array(height).fill(false);
//     map = new Array(width).fill(mapcol);
//}
function update(){
    if(ended){
        ended=false;
        alert("C'est quand même bien mieux des cailloux non ?");
        location.reload();
        //app.loader.load(setup);
        //resetArray();
    }
    tondeuse.x += y*10;
    tondeuse.y += x*10;
    checkTondeusePos(tondeuse);
    brush.x=tondeuse.x;
    brush.y=tondeuse.y;
    updateWay();
    app.renderer.render(brush, renderTexture, false, null, false);
}


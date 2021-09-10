// based on the exemple scratchCard of pixiJS


var tondeuse;
var renderTexture;
var ended=false;
const app = new PIXI.Application();
document.body.appendChild(app.view);
const { stage } = app;
const mouseCoords = app.renderer.plugins.interaction.mouse.global;

// prepare rectangle texture, that will be our brush to clean the garden
const brush = new PIXI.Graphics();
brush.beginFill('0xffffff');
brush.drawRect(0, 0, 35,35);
brush.endFill();

//create 2D array to keep trace of where the TONDEUSE goes.
var width = app.screen.width;
var height = app.screen.height;
var map=[],mapcol;

var map=[],mapcol;
while(map.push(mapcol=[])<width)while (mapcol.push(false)<height);

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
    if(tondeuse.y>app.screen.height-35)tondeuse.y=app.screen.height-35;
    if(tondeuse.y<0)tondeuse.y=0;
    if(tondeuse.x<0)tondeuse.x=0;
    if(tondeuse.x>app.screen.width-35)tondeuse.x=app.screen.width-35;
}

function updateWay(){
    for (var i =Math.round(tondeuse.x);i<tondeuse.x+35;i++){
        for (var j=Math.round(tondeuse.y);j<tondeuse.y+35;j++){
            map[i][j]=true;
        }
    }
}

function checkEnd(){
    var cmpt=0;
    for (var i =0; i<width;i++){
        if(!map[i].includes(false)){
            cmpt+=1;;
        }
        else if(cmpt>790){
            console.log(i);
        }
    }
    if(cmpt==width)ended=true;
    return cmpt;
}


function update(){
    if(ended){
        ended=false;
        alert("C'est quand même bien mieux des cailloux non ?");
        //location.reload();
        app.loader.load(setup);
    }
    //tondeuse.x += y*10;
    //tondeuse.y += x*10;

    tondeuse.x = mouseCoords.x;
    tondeuse.y = mouseCoords.y;

    checkTondeusePos(tondeuse);
    brush.x=tondeuse.x;
    brush.y=tondeuse.y;
    updateWay();
    checkEnd();
    app.renderer.render(brush, renderTexture, false, null, false);
}


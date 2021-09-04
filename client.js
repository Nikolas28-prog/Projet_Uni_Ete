function setup() {
  createCanvas(400, 400, WEBGL);
}

var x=0
var y=0
function draw() {
  background(200);
  rotateX(frameCount *x)
  rotateY(frameCount *y)
  box(100);
}

function normalize(value) {
  if (value > 0.1)
    return 0.1
  else if (value < -0.1)
    return -0.1
  else
    return 0
}

setInterval(httpGetAsync, 500);

function httpGetAsync()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
          data=JSON.parse(xmlHttp.responseText)
          x=data[1]
          y=data[0]
            console.log(xmlHttp.responseText)
        }
    }
    xmlHttp.open("GET", "http://192.168.4.1", true); // true for asynchronous 
    xmlHttp.send();
}
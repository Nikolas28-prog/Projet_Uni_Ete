function setup() {
    createCanvas(400, 400, WEBGL);
  }
  
//   function draw() {
//     if (mouseIsPressed) {
//       fill(0);
//     } else {
//       fill(255);
//     }
//     ellipse(mouseX, mouseY, 80, 80);
//   }



// draw a spinning box
// with width, height and depth of 50
// function setup() {
//     createCanvas(100, 100, WEBGL);
//   }
  
  function draw() {
    background(200);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    box(50);
  }

  fetch("http://192.168.4.1")
  .then(function (response) {
      console.log(response.json())
    return response.json();
  })
  .then(function (myJson) {
    console.log(myJson.ip);
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });

//   setup()
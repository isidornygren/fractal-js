"use strict";

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvas, ctx;

// Redraws the canvas
function draw(){
  // Create a blank image
  var imageData = ctx.createImageData(canvasWidth, canvasHeight);

  // Loop through the image
  for (var i=0; i < imageData.data.length ; i+=4){
    // Calculate current position of image data
    var row = Math.floor(i/(4*canvasWidth));
    var column = Math.floor(i/4 - row*canvasWidth);

    // Calculate percentages of row / column 0-1
    var row_p = (1 + row)/canvasHeight;
    var column_p = (1 + column)/canvasWidth;

    //TODO this produces a fliped set
    var ratio = canvasWidth/canvasHeight
    var color = mandelbrot(row_p - 0.5,1*ratio - column_p*ratio);

    imageData.data[i+0]=color[0]; // R
    imageData.data[i+1]=color[1]; // G
    imageData.data[i+2]=color[2]; // B
    imageData.data[i+3]=255;      // A
  }

  // Write it to the canvas
  ctx.putImageData(imageData,0,0);
}

// Reset the dimensions on window resize
window.onresize = function(event) {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;

  // Set the size of the canvas
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  draw();
};

// Draw the canvas on page load
document.addEventListener("DOMContentLoaded", function(event) {

  canvas = document.getElementById("canvas-fractal");
  ctx = canvas.getContext("2d");

  // Set the size of the canvas
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  draw();
});

"use strict";

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var canvas, ctx;
var x = 0;
var y = 0;
var z = 1; // scaling

var date = new Date();
var initTime = date.getTime();

var workers = [];
var worker_count = 4;

var iterationArray = [];

for (var i = 0; i < worker_count ; i++){
  var worker = newWorker();
  workers.push(worker);
}

function newWorker(){
  return new Worker(URL.createObjectURL(new Blob(["("+mandelbrot_worker.toString()+")()"], {type: 'text/javascript'})));

}
setInterval(function(){
    drawRainBow();
}, 40);
// Draws a beautiful rainbow version of the mandelbrot
function drawRainBow(){
  var tempImage = ctx.createImageData(canvasWidth, canvasHeight);
  var arrayLength = iterationArray.length;

  var date = new Date();
  var time = Math.floor((date.getTime() - initTime)*max/10000);
  console.log(time)

  for(var j = 0; j < arrayLength; j++){
    var delta = (iterationArray[j] + time) % (max);
    //console.log(delta)
    var color = getColor(delta);
    tempImage.data[j*4] = color[0];
    tempImage.data[j*4 + 1] = color[1];
    tempImage.data[j*4 + 2] = color[2];
    tempImage.data[j*4 + 3] = 255;
  }
  ctx.putImageData(tempImage,0,0);
}

// Redraws the canvas
function draw(){
  var d = new Date();
  var startTime = d.getTime();
  var returns = 0;
  // Create a blank image
  var imageData = ctx.createImageData(canvasWidth, canvasHeight);

  // If the browser can handle workers
  if (true) {
    var image_length = imageData.data.length;
    var tot = 0;
    // Loop through workers and initiate new
    for (var i = 0; i < worker_count ; i++){
      var step = 0
      if (i == worker_count - 1){
        // add the last lines to the last worker
        step = image_length - tot
      }else{
        step = (image_length/(worker_count)) - (image_length/(worker_count))%(canvasWidth*4)
      }

      var worker = workers[i];
      // If the worker is already working then stop that worker
      worker.terminate();
      worker = newWorker();
      workers[i] = worker;

      worker.postMessage([tot, tot + step, canvasWidth, canvasHeight, x, y, z]);
      worker.onmessage = function(event){
        var tempImage = ctx.createImageData(canvasWidth, event.data[3]);
        var startPos = event.data[1];
        var endPos = event.data[2];
        var arrayLength = endPos - startPos;
        var fractalArray = event.data[0];

        for(var j = 0; j < arrayLength/4; j++){
          iterationArray[j + startPos/4] = fractalArray[j];
          var color = getColor(fractalArray[j])
          tempImage.data[j*4] = color[0];
          tempImage.data[j*4 + 1] = color[1];
          tempImage.data[j*4 + 2] = color[2];
          tempImage.data[j*4 + 3] = 255;
        }
        // write it to the canvas
        ctx.putImageData(tempImage,0,event.data[4]);
        // Write draw time to canvas
        returns++;
        if(returns == worker_count){
          // update deltatime
          var e = new Date();
          var time = e.getTime() - startTime;
          ctx.fillText("Time since draw: " + time + "ms", 10,20)
        }
      }

      tot += step;
    }
  }else{  // fallback
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
      // var color = mandelbrot(row_p - 0.5,1*ratio - column_p*ratio);
      var scaling = Math.max(canvasWidth, canvasHeight)/4
      var color = mandelbrot((column_p-0.5)*2*ratio/z + x/scaling, (row_p-0.5)*2/z + y/scaling);

      imageData.data[i+0]=color[0]; // R
      imageData.data[i+1]=color[1]; // G
      imageData.data[i+2]=color[2]; // B
      imageData.data[i+3]=255;      // A
    }
    // Write it to the canvas
    ctx.putImageData(imageData,0,0);
    // update deltatime
    var e = new Date();
    var time = e.getTime() - startTime;
    ctx.fillText("Time since draw: " + time + "ms", 10,20)
  }
}

// Reset the dimensions on window resize
window.onresize = function(event) {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  var iterationArray = [];

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

  // Boolean if mouse is clicked
  var clicked = false;
  // origin position and delta position
  var o_x = 0;
  var o_y = 0;
  var d_x = 0;
  var d_y = 0;
  // last position

  // Adds click handle for canvas
  canvas.addEventListener('mousedown', function(event) {
    o_x = event.pageX;
    o_y = event.pageY;
    clicked = true;
  });

  canvas.addEventListener('mouseup', function(event) {
    clicked = false;
  });

  canvas.addEventListener('mouseleave', function(event) {
    clicked = false;
  });

  canvas.addEventListener('wheel', function(event) {
    if (event.deltaY > 0){
      z = z / 2;
      if(z<1)
        z = 1;
    }else if(event.deltaY < 0){
      z = z * 2;
    }
    draw();
  });

  canvas.addEventListener('mousemove', function(event) {
    // Check if the mouse is dragging
    if(clicked){
      d_x = (event.pageX - o_x)/z;
      d_y = (event.pageY - o_y)/z;
      x = x - d_x;
      y = y - d_y;
      o_x = o_x + d_x;
      o_y = o_y + d_y;
      // redraw on mousemovement
      draw();
    }
  });

  draw();
});

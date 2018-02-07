"use strict";

function mandelbrot(){
  var max = 127; // maximum number of iterations

  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  // worker event
  onmessage = function(event) {
    console.log("[" + id + "] Recieved: " + event.data[0] + ", " + event.data[1]);
    var canvasWidth = event.data[2];
    var canvasHeight = event.data[3];
    var x = event.data[4];
    var y = event.data[5];
    var z = event.data[6];
    var ratio = canvasWidth/canvasHeight;
    var scaling = Math.max(canvasWidth, canvasHeight)/4;

    var startPos = event.data[0];
    var endPos = event.data[1];

    var array = [];

    for (var i = 0; i < (endPos - startPos); i+=4){
      // console.log(i)
      // Calculate current position of image data
      var absolutePos = i + startPos;

      var row = Math.floor(absolutePos/(4*canvasWidth));
      var column = Math.floor(absolutePos/4 - row*canvasWidth);

      // Calculate percentages of row / column 0-1
      var row_p = (1 + row)/canvasHeight;
      var column_p = (1 + column)/canvasWidth;

      // var color = mandelbrot(row_p - 0.5,1*ratio - column_p*ratio);
      var color = fractal((column_p-0.5)*2*ratio/z + x/scaling, (row_p-0.5)*2/z + y/scaling);

      //TODO should just return an iteration number
      array[i] = color[0];
      array[i + 1] = color[1];
      array[i + 2] = color[2];
      array[i + 3] = 255; //TODO unnessecary
    }
    // chunk ready, post it
    var height = Math.floor((endPos - startPos)/(4*canvasWidth));

    var position = Math.floor((startPos)/(4*canvasWidth));

    console.log("[" + id + "] Height: " + height);
    postMessage([array, startPos, endPos, height, position]);
  }

  getColor = function(iteration, max){
    var r, g, b;
    var color = [0,0,0,255]
    if (iteration === -1){
      color[0] = 0;
      color[1] = 0;
      color[2] = 0;
    }else if(iteration === 0){
      color[0] = 255;
      color[1] = 0;
      color[2] = 0;
    }else{
      if (iteration < max/8){ // 0 - 12.5%
        color[0] = 16 * (16 - iteration);
        color[1] = 0;
        color[2] = 16 * iteration - 1;
      }else if(iteration < max/4){ // 12.5% - 25%
        color[0] = 0;
        color[1] = 16 * (iteration - 16); //(iteration/max)*255 // 16 * (iteration - 16);
        color[2] = 16 * (32 - iteration) - 1; //255 - 255*(iteration/max) //16 * (32 - iteration) - 1;
      }else if(iteration < max/2){ // 25% - 50%
        color[0] = 8 * (iteration - 32); //(iteration/max)*255//8 * (iteration - 32);
        color[1] = 8 * (64 - iteration) - 1; //255 - 255*(iteration/max)//8 * (64 - iteration) - 1;
        color[2] = 0;
      }else{ // 50% - 100%
        // iteration/max == 0-1
        //color[0] = 255 - (iteration/max)*255
        color[0] = 255 - (iteration - 64) * 4;
        color[1] = 0;
        color[2] = 0;
      }
    }
    return color;
  }

  fractal = function (real, imaginary) {
    var z_real = real;
    var z_imaginary = imaginary;
    var counter = 0;
    var nextRe;

      while (Math.pow(z_real, 2.0) + Math.pow(z_imaginary, 2.0) <= 4.0 && counter <= max) {
        nextRe = Math.pow(z_real, 2.0) - Math.pow(z_imaginary, 2.0) + real;
        z_imaginary = 2.0 * z_real * z_imaginary + imaginary;
        z_real = nextRe;

        if (z_real == real && z_imaginary == imaginary) { // a repetition indicates that the point is in the Mandelbrot set
            return getColor(-1, max); // points in the Mandelbrot set are represented by a return value of -1
        }
        counter += 1;
      }
      if (counter >= max) {
          return getColor(-1, max); // -1 is used here to indicate that the point lies within the Mandelbrot set
      } else {
          return getColor(counter, max); // returning the number of iterations allows for colouring
      }
    }
}

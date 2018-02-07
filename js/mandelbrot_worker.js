"use strict";

function mandelbrot_worker(){
  var max = 256; // maximum number of iterations

  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  // worker event
  onmessage = function(event) {
    var canvasWidth = event.data[2];
    var canvasHeight = event.data[3];
    var x = event.data[4];
    var y = event.data[5];
    var z = event.data[6];
    var ratio = canvasWidth/canvasHeight;
    var scaling = Math.max(canvasWidth, canvasHeight)/4;

    var startPos = event.data[0];
    var endPos = event.data[1];

    var size = (endPos - startPos)/4

    var array = [];

    for (var i = 0; i < size; i++){
      // console.log(i)
      // Calculate current position of image data
      var absolutePos = i + startPos/4;

      var row = Math.floor(absolutePos/(canvasWidth));
      var column = Math.floor(absolutePos - row*canvasWidth);

      // Calculate percentages of row / column 0-1
      var row_p = (1 + row)/canvasHeight;
      var column_p = (1 + column)/canvasWidth;

      var iteration = fractal((column_p-0.5)*2*ratio/z + x/scaling, (row_p-0.5)*2/z + y/scaling);
      array[i] = iteration;
    }
    // chunk ready, post it
    var height = Math.floor((endPos - startPos)/(4*canvasWidth));

    var position = Math.floor((startPos)/(4*canvasWidth));
    postMessage([array, startPos, endPos, height, position]);
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
            return -1; // points in the Mandelbrot set are represented by a return value of -1
        }
        counter += 1;
      }
      if (counter >= max) {
          return -1; // -1 is used here to indicate that the point lies within the Mandelbrot set
      } else {
          return counter; // returning the number of iterations allows for colouring
      }
    }
}

"use strict";
var max = 64; // maximum number of iterations
var colors = [];
colors[-1] = [255,255,255];

for(var i = 0; i < (max + 1); i++){
  var color = [255 - 255*(i/max),255 - 255*(i/max),255 - 255*(i/max),255];
  colors[i] = color;
}

function mandelbrot(real, imaginary){
  var z_real = real;
  var z_imaginary = imaginary;
  var counter = 0;
  var nextRe;

  while (Math.pow(z_real, 2.0) + Math.pow(z_imaginary, 2.0) <= 4.0 && counter <= max) {
    nextRe = Math.pow(z_real, 2.0) - Math.pow(z_imaginary, 2.0) + real;
    z_imaginary = 2.0 * z_real * z_imaginary + imaginary;
    z_real = nextRe;

    if (z_real == real && z_imaginary == imaginary) { // a repetition indicates that the point is in the Mandelbrot set
        return getColor(-1); // points in the Mandelbrot set are represented by a return value of -1
    }
    counter += 1;
  }
  if (counter >= max) {
      return getColor(-1); // -1 is used here to indicate that the point lies within the Mandelbrot set
  } else {
      return getColor(counter); // returning the number of iterations allows for colouring
  }
}

function getColor(iteration){
  return colors[iteration];
}

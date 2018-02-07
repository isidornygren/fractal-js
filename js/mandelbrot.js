"use strict";
var max = 128; // maximum number of iterations
var colors = [];
colors[-1] = [0,0,0];

// Create colour gradient
for(var i = 0; i < Math.ceil((max + 1)/3); i++){
  var localMax = Math.ceil((max + 1)/3)
  var color = [255 - 255*(i/localMax),255*(i/localMax),0,255];
  colors[i] = color;
}
for(var i = Math.ceil((max + 1)/3); i < Math.ceil(2*(max + 1)/3); i++){
  var localStart = Math.ceil((max + 1)/3);
  var localMax = Math.ceil((max + 1)/3);
  var color = [0,255 - 255*((i - localStart)/localMax),255*((i - localStart)/localMax),255];
  colors[i] = color;
}
for(var i = Math.ceil(2*(max + 1)/3); i < (max + 1); i++){
  var localStart = Math.ceil(2*(max + 1)/3);
  var localMax = Math.ceil((max + 1)/3);
  var color = [255*((i - localStart)/localMax),0,255 - 255*((i - localStart)/localMax),255];
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

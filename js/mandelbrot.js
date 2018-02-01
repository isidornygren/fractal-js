"use strict";

var max = 127; // maximum number of iterations

function mandelbrot(real, imaginary){
  //console.log(real + ", " + imaginary)
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

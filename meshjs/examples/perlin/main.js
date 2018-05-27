/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import mesh from "../../lib/mesh.js";
import noise from "../../lib/noise.js";
import Color from "../../lib/color.js";

/************ CONFIG **************/

const config = {
  /**** required for mesh lib ******/

  //name of container that generated canvas will be created in
  PARENT_ID: "canvas_container",

  //app name, used for saving files
  APP_NAME: window.location.pathname.replace(/\//gi, ""),

  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  //Dimension canvas will be display at on page
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#000000",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //whether a single frame is rendered, or draw is called based on FPS setting
  ANIMATE: true,
  FPS: 30,

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false,

  /*********** APP Specific Settings ************/

  SCALE: 8
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;

let cols;
let rows;
let inc = 0.01;
let zinc = 0.05;
let zoff;

/*************** CODE ******************/

const init = function(canvas) {
  ctx = canvas.context;
  bounds = canvas.bounds;

  rows = Math.floor(bounds.height / config.SCALE);
  cols = Math.floor(bounds.width / config.SCALE);

  zoff = Math.random(10000);
};

const draw = function() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let r = noise(yoff, xoff, zoff) * 255;

      let c = new Color(r);

      ctx.fillStyle = c.toRGBA();
      ctx.fillRect(
        x * config.SCALE,
        y * config.SCALE,
        config.SCALE,
        config.SCALE
      );

      xoff += inc;
    }
    yoff += inc;
  }

  zoff += zinc;
};

window.onload = function() {
  mesh.init(config, init, draw);
};

/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import mesh from "../lib/mesh.js";

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

  //Max dimension canvas will be display at on page
  //note, exact dimension will depend on RENDER_HEIGHT / width and
  //ratio to these properties.
  //Canvas display will be scaled to maintain aspect ratio
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#EEEEEE",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //whether a single frame is rendered, or draw is called based on FPS setting
  ANIMATE: false,
  FPS: 60,

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false

  /*********** APP Specific Settings ************/
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;

/*************** CODE ******************/

const init = function(canvas) {
  ctx = canvas.context;
  bounds = canvas.bounds;
};

const draw = function(canvas, frameCount) {};

window.onload = function() {
  mesh.init(config, init, draw);
};

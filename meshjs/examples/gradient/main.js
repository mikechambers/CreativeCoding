/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import Gradient, { gradientFromName } from "../../lib/gradient.js";
import mesh from "../../lib/mesh.js";

/************ CONFIG **************/

const config = {
	/**** required for mesh lib ******/

	//name of container that generated canvas will be created in
	PARENT_ID: "canvas_container",

	//app name, used for saving files
	APP_NAME: window.location.pathname.replace(/\//gi, ""),

	//Dimensions that canvas will be rendered at
	RENDER_HEIGHT: 1080,
	RENDER_WIDTH: 1920,

	//Max dimension canvas will be display at on page
	//note, exact dimension will depend on RENDER_HEIGHT / width and
	//ratio to these properties.
	//Canvas display will be scaled to maintain aspect ratio
	MAX_DISPLAY_HEIGHT: 640,
	MAX_DISPLAY_WIDTH: 640,

	//background color of html page
	BACKGROUND_COLOR: "#FFFFFF",

	//background color for display and offscreen canvas
	CANVAS_BACKGROUND_COLOR: "#FFFFFF",

	//whether a single frame is rendered, or draw is called based on FPS setting
	ANIMATE: false,
	FPS: 30,

	//Where video of canvas is recorded
	RECORD_VIDEO: false,

	//whether canvas should be cleared prior to each call to draw
	CLEAR_CANVAS: false,

	/*********** APP Specific Settings ************/

	GRADIENT_NAME: "Rainbow Blue"
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;
let canvas;

let cols;
let rows;
let zoff = 0;

let particles;
let vectors;

let pixelData;

/*************** CODE ******************/

//three methods to impliment
// init() (currently )

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;
};

const draw = function() {
	let gradient = gradientFromName(
		"Rainbow Blue",
		bounds,
		Gradient.TOP_RIGHT_TO_BOTTOM_LEFT
	);
	gradient.create();

	ctx.drawImage(
		gradient.canvas,
		bounds.x,
		bounds.y,
		bounds.width,
		bounds.height
	);
};

window.onload = function() {
	mesh.init(config, init, draw);
};

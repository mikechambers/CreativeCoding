/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import Gradient from "../lib/gradient.js"
import * as mesh from "../lib/mesh.js"

/************ CONFIG **************/

const config = {
	/**** required for mesh lib ******/

	//name of container that generated canvas will be created in
	PARENT_ID:"canvas_container",

	//app name, used for saving files
	APP_NAME: window.location.pathname.replace(/\//gi, ""),

	//Canvas dimensions on page
	CANVAS_HEIGHT:640,
	CANVAS_WIDTH:640,

	//offscreen render settings. If true, drawing will happen offscreen
	//and then be copied to display canvas. Image and video captures will be
	//from offscreen renderered.
	RENDER_OFFSCREEN:true,
	RENDER_HEIGHT:1080,
	RENDER_WIDTH:1920,

	//background color of html page
	BACKGROUND_COLOR:"#000000",

	//background color for display and offscreen canvas
	CANVAS_BACKGROUND_COLOR:"#FFFFFF",

	//whether a single frame is rendered, or draw is called based on FPS setting
	ANIMATE:false,
	FPS:30,

	//Where video of canvas is recorded
	RECORD_VIDEO:false,

	//whether canvas should be cleared prior to each call to draw
	CLEAR_CANVAS:false,

	/*********** APP Specific Settings ************/

	GRADIENT_NAME:"Rainbow Blue"

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
}

const draw = function() {
	let gradient = new Gradient(bounds);
	let c = gradient.createGradientFromName("Rainbow Blue");

	ctx.drawImage(c, bounds.x, bounds.y, bounds.width, bounds.height);
}

window.onload = function(){
	mesh.init(config, init, draw);
}

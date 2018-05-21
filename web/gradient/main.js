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
	CANVAS_ID:"canvas_container",
	APP_NAME: window.location.pathname.replace(/\//gi, ""),
	CANVAS_HEIGHT:640,
	CANVAS_WIDTH:640,
	BACKGROUND_COLOR:"#000000",
	CANVAS_BACKGROUND_COLOR:"#FFFFFF",
	ANIMATE:false,
	RECORD_VIDEO:false,
	FPS:30,
	CLEAR_CANVAS:false,


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
	draw();
}

const draw = function() {
	let gradient = new Gradient(bounds);
	let c = gradient.createGradientFromName("Rainbow Blue");

	ctx.drawImage(c, bounds.x, bounds.y, bounds.width, bounds.height);
}

window.onload = function(){
	mesh.init(config, init, draw);
}

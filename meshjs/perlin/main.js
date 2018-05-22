/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import * as mesh from "../lib/mesh.js"
import noise from "../lib/noise.js"
import Color from  "../lib/color.js"

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
	RENDER_OFFSCREEN:false,
	RENDER_HEIGHT:1080,
	RENDER_WIDTH:1080,

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

	SCALE:2
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;

let cols;
let rows;
let inc = 0.01;
let zoff;

/*************** CODE ******************/

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;

	rows = Math.floor(bounds.height / config.SCALE);
	cols = Math.floor(bounds.width / config.SCALE);

	zoff = Math.random(10000);
}

const draw = function() {

	let yoff = 0;
	for(let y = 0; y < rows; y++) {
		let xoff = 0;
		for(let x = 0; x < cols; x++) {
			let r = noise(yoff, xoff, zoff) * 255;

			let c = new Color(r);

			ctx.fillStyle = c.toRGBA();
			ctx.fillRect(x * config.SCALE, y * config.SCALE, config.SCALE, config.SCALE);

			xoff += inc;
		}
		yoff += inc;
	}

	zoff  += inc;

}

window.onload = function(){
	mesh.init(config, init, draw);
}

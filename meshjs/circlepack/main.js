/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import * as mesh from "../lib/mesh.js"
import Circle from "./circle.js"
import {randomPointsInBounds, pointIsInCircle, randomPointInBounds} from "../lib/utils.js"
import Vector from "../lib/vector.js"
import Color from "../lib/color.js"

/************ CONFIG **************/

const config = {
	/**** required for mesh lib ******/

	//name of container that generated canvas will be created in
	PARENT_ID:"canvas_container",

	//app name, used for saving files
	APP_NAME: window.location.pathname.replace(/\//gi, ""),

	//Dimensions that canvas will be rendered at
	RENDER_HEIGHT:1080,
	RENDER_WIDTH:1080,

	//Max dimension canvas will be display at on page
	//note, exact dimension will depend on RENDER_HEIGHT / width and
	//ratio to these properties.
	//Canvas display will be scaled to maintain aspect ratio
	MAX_DISPLAY_HEIGHT:640,
	MAX_DISPLAY_WIDTH:640,

	//background color of html page
	BACKGROUND_COLOR:"#000000",

	//background color for display and offscreen canvas
	CANVAS_BACKGROUND_COLOR:"#000000",

	//whether a single frame is rendered, or draw is called based on FPS setting
	ANIMATE:true,
	FPS:60,

	//Where video of canvas is recorded
	RECORD_VIDEO:true,

	//whether canvas should be cleared prior to each call to draw
	CLEAR_CANVAS:true,

	/*********** APP Specific Settings ************/

	RADIUS:4,
	BOUNDS_PADDING:0,
	STROKE_COLOR:new Color(0),
	STROKE_SIZE:2
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;
let circles;

let pAmount;

/*************** CODE ******************/

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;

	circles = [];

	let c = new Circle(bounds.center, 100);
	c.fillColor = new Color(0);
	c.strokeColor = new Color(0);
	c.shouldGrow = false;

	circles.push(c);

	pAmount = 1;
}


const draw = function(canvas, frameCount) {

	let points = [];

	if(circles.length > 10 || !(frameCount % 100)) {
		points = randomPointsInBounds(bounds, pAmount);
	}

	if(circles.length > 10 && !(frameCount % 120)) {
		pAmount++;

		if(pAmount > 100) {
			pAmount = 100;
		}
	}

	for(let p of points) {

		let found = false;
		for(let i = 0; i < circles.length; i++) {
			let c = circles[i];
			//todo: change function to also take a circle
			if(pointIsInCircle(c.position, (c.radius + config.RADIUS/2), p)) {
				found = true;
			}
		}

		if(!found) {
			let c = new Circle(p, config.RADIUS);
			c.boundsPadding = config.BOUNDS_PADDING;
			c.strokeColor = config.STROKE_COLOR;
			c.strokeSize = config.STROKE_SIZE;
			circles.push(c);
		}
	}

	for(let c of circles) {
		c.checkCollisions(bounds, circles);
		c.grow();
		c.draw(ctx);
	}

}

window.onload = function(){
	mesh.init(config, init, draw);
}

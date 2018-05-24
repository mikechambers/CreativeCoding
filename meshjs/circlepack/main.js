/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import * as mesh from "../lib/mesh.js"
import Circle from "./circle.js"
import {downloadSVG} from "../lib/datautils.js"
import {randomPointsInBounds, pointIsInCircle, randomPointInBounds, pointOnCircle} from "../lib/utils.js"
import Vector from "../lib/vector.js"
import Color from "../lib/color.js"
import {getRandomColorPallete} from "../lib/colorpallete.js"

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
	CANVAS_BACKGROUND_COLOR:"#FFFFFF",

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
	STROKE_COLOR:"#FFFFFF",
	STROKE_SIZE:2
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;
let circles;

let pAmount;
let pallete;

/*************** CODE ******************/

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;

	pallete = getRandomColorPallete();

	circles = [];

	pAmount = 1;
}


const draw = function(canvas, frameCount) {

	let points = [];

/*
	if(circles.length > 10 || !(frameCount % 100)) {
		points = randomPointsInBounds(bounds, pAmount);
	}

	if(circles.length > 10 && !(frameCount % 120)) {
		pAmount++;

		if(pAmount > 100) {
			pAmount = 100;
		}
	}
*/

	let count = 1;
	if(circles.length > 10) {
		if(circles.length > 50) {
			count = 50;
		} else {
			count = 2;
		}
	}

	points = randomPointsInBounds(bounds.withPadding(100), 2);

	for(let p of points) {

		let found = false;
		for(let i = 0; i < circles.length; i++) {
			let c = circles[i];
			//todo: change function to also take a circle
			//todo: still getting some overlap
			//if(pointIsInCircle(c.position, (c.radius + config.RADIUS/2), p)) {

			//todo: we could change this to see if the new circle will overlap with an
			//existing one, but then that requires we create a circle instance first

			if(pointIsInCircle(c.position, (c.radius + config.RADIUS / 2 + config.STROKE_SIZE), p)) {
				found = true;
			}
		}

		if(!found) {
			let c = new Circle(p, config.RADIUS);
			c.boundsPadding = config.BOUNDS_PADDING;
			c.strokeColor = Color.fromHex(config.STROKE_COLOR);
			c.strokeSize = config.STROKE_SIZE;
			c.fillColor = pallete.getNextColor();
			circles.push(c);
		}
	}

	for(let c of circles) {
		c.checkCollisions(bounds, circles);
		c.grow();
		c.draw(ctx);
	}
}

const initDiamond = function() {

	let r = bounds.width / 2;

	let tmp = [];
	tmp.push(new Circle(bounds.topLeft, r));
	tmp.push(new Circle(bounds.topRight, r));
	tmp.push(new Circle(bounds.bottomRight, r));
	tmp.push(new Circle(bounds.bottomLeft, r));

	for(let c of tmp) {
		c.fillColor = Color.fromHex(config.CANVAS_BACKGROUND_COLOR);
		c.strokeColor = Color.fromHex(config.CANVAS_BACKGROUND_COLOR);
		c.shouldGrow = false;
	}

	circles.push(...tmp);
}

const initDonut = function() {

	let color = Color.fromHex(config.CANVAS_BACKGROUND_COLOR);
	let c = new Circle(bounds.center, 100);
	c.fillColor = color;
	c.strokeColor = color;
	c.shouldGrow = false;

	circles.push(c);


	let stepSize = (Math.PI * 2) / 40;
	for(let i = 0; i < Math.PI * 2; i += stepSize) {

		//get point on circle

		let center = pointOnCircle(bounds.center, 700, i);

		let c2 = new Circle(center, 200);
		c2.fillColor = color;
		c2.strokeColor = color;
		c2.shouldGrow = false;

		circles.push(c2);
	}
}

const createSVG = function() {
	let svg = `<?xml version="1.0" standalone="no"?>\n
		<svg width="${config.RENDER_WIDTH}" height="${config.RENDER_HEIGHT}"
		version="1.1" xmlns="http://www.w3.org/2000/svg">\n`

	svg = svg + `<rect x="0" y="0" width="${config.RENDER_WIDTH}"
				height="${config.RENDER_HEIGHT}"
				fill="${config.BACKGROUND_COLOR}"/>`;

		for(let c of circles) {
			svg = svg + c.toSVG();
		}

	svg = svg + "</svg>";

	return svg;
}

const onKeyUp = function(event) {
	if(event.key === "s") {
		let svg = createSVG();
		downloadSVG(svg, config.APP_NAME);
	}
}

window.onload = function(){
	mesh.init(config, init, draw);

	window.addEventListener("keyup", onKeyUp);
}

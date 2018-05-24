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
import {getRandomColorPallete, getColorPallete} from "../lib/colorpallete.js"
import {randomInt} from "../lib/math.js"

/************ CONFIG **************/

const config = {
	/**** required for mesh lib ******/

	//name of container that generated canvas will be created in
	PARENT_ID:"canvas_container",

	//app name, used for saving files
	APP_NAME: window.location.pathname.replace(/\//gi, ""),

	//Dimensions that canvas will be rendered at
	RENDER_HEIGHT:1600,
	RENDER_WIDTH:2560,

	//Max dimension canvas will be display at on page
	//note, exact dimension will depend on RENDER_HEIGHT / width and
	//ratio to these properties.
	//Canvas display will be scaled to maintain aspect ratio
	MAX_DISPLAY_HEIGHT:640,
	MAX_DISPLAY_WIDTH:640,

	//background color of html page
	BACKGROUND_COLOR:"#FFFFFF",

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
	CIRCLE_BOUNDS_PADDING:8,
	STROKE_COLOR:"#FFFFFF",
	FILL_COLOR:"#FFFFFF",
	USE_COLOR_PALLETE:true,
	STROKE_SIZE:8,
	DRAW_BY_DEFAULT:false, //hit d key to toggle whether frames are rendered
	INIT_AFTER_COMPLETE:true
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;
let circles;

let pAmount;
let pallete;

let pixels;
let _doDraw;
let _completed;
let _completedCaptured;

/*************** CODE ******************/

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds.withPadding(config.BOUNDS_PADDING);

	pixels = [];
	_completed = false;
	_completedCaptured = false;
	_doDraw = config.DRAW_BY_DEFAULT;

	mesh.setPaused(false);

	pallete = getRandomColorPallete();

	circles = [];

	//uncomment one of these function to create a mask for the circle packing
	//createDonotMask();
	//createDiamondMask();

	for(let y = bounds.y; y < bounds.y + bounds.height; y++) {
		for(let x = bounds.x; x < bounds.x +  bounds.width; x++) {
			pixels.push(new Vector(x, y));
		}
	}

	shuffle(pixels);

	pAmount = 1;
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const getRandomPoints = function(count) {

	if(pixels.length == 0) {
		console.log("done");
		mesh.setPaused(true);
		_doDraw = true;
		_completed = true;
		return [];
	}

	if(pixels.length < count) {
		count = pixels.length;
	}

	return pixels.splice(-count, count);
}

const draw = function(canvas, frameCount) {

	if(!(frameCount % 60)) {
		console.log(pixels.length, circles.length);
	}

	let count = 0;
	if(circles.length < 20) {
		if(!(frameCount % 30)) {
			count = 1;
		}
	} else if (circles.length > 3000) {
		count = 500;
	} else {
		if(frameCount % 2) {
			pAmount++;
		}

		if(pAmount > 50) {
			pAmount = 50;
		}

		count = pAmount;
	}

	let points = [];
	if(count) {
		points = getRandomPoints(count);
	}

	for(let p of points) {

		let found = false;
		for(let i = 0; i < circles.length; i++) {
			let c = circles[i];
			//todo: change function to also take a circle
			//todo: still getting some overlap
			//if(pointIsInCircle(c.position, (c.radius + config.RADIUS/2), p)) {

			//todo: we could change this to see if the new circle will overlap with an
			//existing one, but then that requires we create a circle instance first

			if(pointIsInCircle(c.position, (c.radius + config.RADIUS / 2 +
					config.STROKE_SIZE), p)) {
				found = true;
			}
		}

		if(!found) {
			let c = new Circle(p, config.RADIUS);
			c.boundsPadding = config.CIRCLE_BOUNDS_PADDING;
			c.strokeColor = Color.fromHex(config.STROKE_COLOR);
			c.strokeSize = config.STROKE_SIZE;

			c.fillColor = (config.USE_COLOR_PALLETE)?
				pallete.getNextColor():Color.fromHex(config.FILL_COLOR);
			circles.push(c);
		}
	}

	for(let c of circles) {
		c.checkCollisions(bounds, circles);
		c.grow();

		if(_doDraw) {
			c.draw(ctx);
		}
	}

	if(_completed & !_completedCaptured) {
		mesh.downloadPng();
		_completedCaptured = true;

		if(config.INIT_AFTER_COMPLETE) {
			init(canvas);
		}
	}
}

const createDiamondMask = function() {

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

const createDonotMask = function() {

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
	} else if (event.key === "d") {
		_doDraw = !_doDraw;
	}
}

window.onload = function(){
	mesh.init(config, init, draw);

	window.addEventListener("keyup", onKeyUp);
}

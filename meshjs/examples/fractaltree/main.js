/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import mesh from "../../lib/mesh.js";
import Vector from "../../lib/vector.js";
import Circle from "../../lib/circle.js";
import Color from "../../lib/color.js";
import { map } from "../../lib/math.js";

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
	BACKGROUND_COLOR: "#000000",

	//background color for display and offscreen canvas
	CANVAS_BACKGROUND_COLOR: "#222222",

	//whether a single frame is rendered, or draw is called based on FPS setting
	ANIMATE: true,
	FPS: 60,

	//Where video of canvas is recorded
	RECORD_VIDEO: true,

	//whether canvas should be cleared prior to each call to draw
	CLEAR_CANVAS: true,

	/*********** APP Specific Settings ************/
	STROKE_COLOR: "#FFFFFF",
	START_LENGTH: 300,
	STROKE_WIDTH: 2
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;

let circle;
let angle = 0;

let mousePosition = new Vector();

/*************** CODE ******************/

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;

	circle = new Circle(new Vector(-50, -50), 6);
	circle.fillColor = Color.WHITE;
};

const draw = function(canvas, frameCount) {
	circle.center.x = mousePosition.x;
	circle.center.y = bounds.height;
	circle.draw(ctx);

	angle = map(circle.center.x, 0, bounds.width, 0, Math.PI * 2);

	ctx.save();
	ctx.translate(bounds.center.x, bounds.height);
	branch(config.START_LENGTH);
	ctx.restore();
};

const branch = function(len) {
	if (len < 4) {
		return;
	}

	drawLine(new Vector(0, 0), new Vector(0, -len));
	ctx.translate(0, -len);

	ctx.save();
	ctx.rotate(angle);
	branch(len * 0.67);
	ctx.restore();

	ctx.save();
	ctx.rotate(-angle);
	branch(len * 0.67);
	ctx.restore();
};

const drawLine = function(start, end) {
	ctx.beginPath();
	ctx.strokeStyle = config.STROKE_COLOR;
	ctx.lineWidth = config.STROKE_WIDTH;
	ctx.moveTo(start.x, start.y);
	ctx.lineTo(end.x, end.y);
	ctx.stroke();
};

const mousemove = function(event, vector) {
	mousePosition = vector;
};

window.onload = function() {
	mesh.init(config, init, draw);
	mesh.listen(mousemove);
};

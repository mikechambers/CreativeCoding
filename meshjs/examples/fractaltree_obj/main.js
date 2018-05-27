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
import Branch from "./branch.js";
import * as utils from "../../lib/utils.js";
import ColorPalette, { randomColorPallete } from "../../lib/colorpallete.js";
import Gradient, { gradientFromName } from "../../lib/gradient.js";

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

	LEAF_COLOR: "#00FF00",
	LEAF_RADIUS: 8,
	NODE_RADIUS: 3,
	LEAF_OPACITY: 0.8,
	BRANCH_COLOR: "#EEEEEE",
	GRADIENT_NAME: "ServQuick"
};

/************** GLOBAL VARIABLES ************/

//hot pink : 255,20,147

let ctx;
let bounds;

let circle;
let angle = 3 * Math.PI / 2;

let mousePosition = new Vector();

let colorPallete;
let gradient;

/*************** CODE ******************/

let tree;
let leafColor;
const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;

	gradient = gradientFromName(
		config.GRADIENT_NAME,
		bounds,
		Gradient.BOTTOM_TO_TOP
	);
	gradient.create();

	tree = [];

	colorPallete = randomColorPallete();

	let root = new Branch(
		new Vector(bounds.center.x, bounds.height),
		new Vector(bounds.center.x, bounds.height - bounds.height / 5)
	);

	initBranch(root);

	tree.push(root);

	for (let i = 0; i < 10; i++) {
		spawnBranches();
	}
};

const draw = function(canvas, frameCount) {
	ctx.drawImage(
		gradient.canvas,
		bounds.x,
		bounds.y,
		bounds.width,
		bounds.height
	);

	for (let b of tree) {
		b.draw(ctx);
	}
};

const initBranch = function(b) {
	let c = colorPallete.randomColor();
	c.alpha = config.LEAF_OPACITY;
	b.leafColor = c;
	b.leafRadius = config.LEAF_RADIUS;
	b.nodeRadius = config.NODE_RADIUS;
	b.branchColor = Color.fromHex(config.BRANCH_COLOR);
};

const spawnBranches = function() {
	let len = tree.length;
	for (let i = 0; i < len; i++) {
		let b = tree[i];

		if (b.hasChildren) {
			continue;
		}

		let children = tree[i].spawn();

		for (let b of children) {
			initBranch(b);
			tree.push(b);
		}
	}
};

const click = function(event, vector) {
	spawnBranches();
};

window.onload = function() {
	mesh.init(config, init, draw);
	mesh.listen(click);
};

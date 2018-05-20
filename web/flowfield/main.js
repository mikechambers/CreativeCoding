/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import * as mesh from "./mesh.js"
//import Rectangle from "./Rectangle.js"
import Vector from "./Vector.js"
import {noise} from "./noise.js"
import Color from "./color.js"
import Particle from "./Particle.js"
import {random} from "./math.js"
//import Canvas from "./Canvas.js"
//import {createFileName} from "./datautils.js"

(function(){
"use strict";

/************ CONFIG **************/

const config = {
	/**** required for mesh lib ******/
	CANVAS_ID:"canvas_container",
	APP_NAME: window.location.pathname.replace(/\//gi, ""),
	CANVAS_HEIGHT:640,
	CANVAS_WIDTH:640,
	BACKGROUND_COLOR:"#000000",
	CANVAS_BACKGROUND_COLOR:"#FFFFFF",
	ANIMATE:true,
	RECORD_VIDEO:false,
	FPS:30,
	CLEAR_CANVAS:false,

	/***** app specific *****/
	SCALE: 20,
	INCREMENT:0.1,
	PARTICLE_RADIUS:1,
	PARTICLE_COUNT:1000,
	PARTICLE_COLOR:Color.getRGBA(0, 0, 0, 0.1),
	DRAW_VECTORS:false
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

/*************** CODE ******************/

//three methods to impliment
// init() (currently )

const init = function(canvas) {

	ctx = canvas.context;
	bounds = canvas.bounds;

	canvas.clear();

	cols = Math.floor(bounds.width / config.SCALE);
	rows = Math.floor(bounds.height / config.SCALE);

	zoff  = random(10000);

	vectors = new Array(rows * cols);

	particles = [];

	for(let i = 0; i < config.PARTICLE_COUNT; i++) {
		let p = new Particle(bounds, config.PARTICLE_RADIUS, config.PARTICLE_COLOR);

		//move random point to function
		p.position = new Vector(
			random(bounds.width),
			random(bounds.height)
		);

		/*
		p.velocity = new Vector(
			math.random(-2, 2),
			math.random(-2, 2)
		);
		*/

		particles.push(p);
	}

	draw();
}

const draw = function() {
	console.log("draw");

	//need to clear vector array?

	let yoff = 0;
	for(let y = 0; y < rows; y++) {
		let xoff = 0;
		for(let x = 0; x < cols; x++) {
			let index = (x + y * cols);

			let angle = noise(xoff, yoff, zoff) * (Math.PI * 2);

			let v = Vector.fromAngle(angle);
			v.magnitude = 3;

			vectors[index] = v;

			ctx.save();

			if(config.DRAW_VECTORS) {
				ctx.translate(x * config.SCALE, y * config.SCALE);
				ctx.rotate(v.heading);

				ctx.strokeStyle = "rgb(0, 0, 0, 0.2)";
				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.lineTo(config.SCALE, 0);
				ctx.stroke();

				ctx.restore();
			}
			xoff += config.INCREMENT;
		}
		yoff += config.INCREMENT;
	}
	zoff += 0.01;

	for(const [i, p] of particles.entries()) {

		let x = Math.floor(p.position.x / config.SCALE);
		let y = Math.floor(p.position.y / config.SCALE);
		let index = x + y * cols;

		let force = vectors[index];

		p.applyForce(force);

		p.update();
		p.show(ctx);
	}
}

window.onload = function(){
	mesh.init(config, init, draw);
}

}());

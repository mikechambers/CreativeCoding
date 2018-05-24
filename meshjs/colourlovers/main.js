/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import * as mesh from "../lib/mesh.js"
import {downloadJSON} from "../lib/datautils.js"
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
	CANVAS_BACKGROUND_COLOR:"#FFFFFF",

	//whether a single frame is rendered, or draw is called based on FPS setting
	ANIMATE:false,
	FPS:30,

	//Where video of canvas is recorded
	RECORD_VIDEO:false,

	//whether canvas should be cleared prior to each call to draw
	CLEAR_CANVAS:false

	/*********** APP Specific Settings ************/

};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;

/*************** CODE ******************/

const init = function(canvas) {
	ctx = canvas.context;
	bounds = canvas.bounds;
}

const draw = function(canvas) {
}

//https://stackoverflow.com/a/46719196/10232
let regex = /[^\u0000-\u00ff]/; // Small performance gain from pre-compiling the regex
function stringContainsDoubleByte(str) {
    if (!str.length) return false;
    if (str.charCodeAt(0) > 255) return true;
    return regex.test(str);
}

const onJsonLoad =  function(request) {
	let palletes = request.response;

	let out = [];
	for(let p of palletes) {

		let title = p.title;

		//our json downloader doesnt support unicode chars
		//so we just filter them out here
		if(stringContainsDoubleByte(title)) {
			continue;
		}

		let tmp = [];

		for(let c of p.colors) {
			let _c = Color.fromHex(c);
			tmp.push({
				r:_c.r,
				g:_c.g,
				b:_c.b
			});
		}

		out.push({name:title, colors:tmp});
	}

	downloadJSON(out, config.APP_NAME);
}

window.onload = function(){
	mesh.init(config, init, draw);

	var request = new XMLHttpRequest();

	//from http://www.colourlovers.com/api
	request.open('GET', "colors.json");

	request.responseType = 'json';
	request.send();

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == "200") {
			onJsonLoad(request);
		}
	}
}

## mesh.js

My personal JavaScript / canvas creative coding framework.

The core philosophy behind the framework is to create a framework focused on creative coding for image and video output. It is not useful for web deployment, as it is only developed / tested on Google Chrome and leverages the latest features and apis (including experimental features).

The goal is to provide a framework that makes it fast to do creative coding on HTML canvas. It does not try to hide the underlying canvas drawing APIs, but rather provide apis around it useful for creative coding.

### Features
* Quick and easy to get started.
* Config object based configuration, making it easy to quickly iterate, and save settings.
* Built in functionality for saving PNGs (hit "p") and videos (hit "v" when config.RECORD_VIDEO is set to true).
* Built in support for high resolution off screen canvas rendering (just set in config) which makes it easy for high resolution image and video capture.
* APIs to make it easy to grab and use pixel data / colors from images and gradients.

In general, I add new features and APIs as I need them.

### Keyboard Shortcuts

The following keyboard shortcuts are built in (currently no way to disable via API).

**p** : Save and download current canvas view as a PNG. Note, if using an offscreen canvas, the PNG will be generated from that canvas.  

**v** : If config.RECORD_VIDEO is set to true, will generate and download a "webm" video of the canvas since the page was loaded.  

**SPACE** : Toggles animation (basically whether draw() is called).  

**i** : Calls the init() function for the project. Useful if you want to quickly generate new views of a project.

### Project Template

Here is a super simple template for what is required to get started:

````javascript

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
	RENDER_HEIGHT:1280,
	RENDER_WIDTH:1280,

	//background color of html page
	BACKGROUND_COLOR:"#000000",

	//background color for display and offscreen canvas
	CANVAS_BACKGROUND_COLOR:"#FFFFFF",

	//whether a single frame is rendered, or draw is called based on FPS setting
	ANIMATE:true,
	FPS:30,

	//Where video of canvas is recorded
	RECORD_VIDEO:false,

	//whether canvas should be cleared prior to each call to draw
	CLEAR_CANVAS:false,
};

/************** GLOBAL VARIABLES ************/


/*************** CODE ******************/
const init = function(canvas) {

}

const draw = function() {

}

window.onload = function(){
	mesh.init(config, init, draw);
}
````

With the following index.html page:

````html
<html>
<head>
	<script type="module" src="main.js"></script>
	<style type="text/css">
		#canvas_container {
			display:flex;
			justify-content:center;
		}
	</style>

</head>
<body>
	<div id="canvas_container"></div>
</body>
</html>
````

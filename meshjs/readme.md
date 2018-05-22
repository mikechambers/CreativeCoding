## mesh.js

My personal JavaScript / canvas creative coding framework.

The core philosophy behind the framework is to create a framework focused on creative coding for image and video output. It is not useful for web deployment, as it is only developed / tested on Google Chrome and leverages the latest features and apis (including experimental features).

The goal is to provide a framework that makes it fast to do creative coding on HTML canvas. It does not try to hide the underlying canvas drawing APIs, but rather provide apis around it useful for creative coding.

### Features
* Quick and easy to get started.
* Config object based configuration, making it easy to quickly iterate, and save settings.
* Built in functionality for saving PNGs (hit "p") and videos (hit "v" when config.RECORD_VIDEO is set to true).
* Automatic support for rendering canvas at high resolution, but displaying at smaller size.
* APIs to make it easy to grab and use pixel data / colors from images and gradients.

In general, I add new features and APIs as I need them.

### Usage

The project includes a template folder that makes it easy to get started. Just copy and rename the folder, and add your code to `main.js`.

1. Specify configuration settings at the top of `main.js` in the `config` object. You can also add your own settings to the config object.
2. Add any initialization code to the `init' function. This will be called once at start up (and also re-called any time you press the "i" key).
3. Add rendering code and logic to the `draw` function. If `config.ANIMATE` is set to false, the draw function will be called once after init is called. If `config.ANIMATE` is true, then draw will be called repeatedly, with the frequency depending on the `config.FPS` setting.

### Keyboard Shortcuts

The following keyboard shortcuts are built in (currently no way to disable via API).

**p** : Save and download current canvas view as a PNG. Note, if using an offscreen canvas, the PNG will be generated from that canvas.  

**v** : If `config.RECORD_VIDEO` is set to true, will generate and download a "webm" video of the canvas since the page was loaded.  

**SPACE** : Toggles animation (basically whether `draw()` is called).  

**i** : Calls the `init()`` function for the project. Useful if you want to quickly generate new views of a project.

### Project Template

You can find a template for getting started in the `template` folder. Just add code your code to the `init()` and `draw()` methods.

### License

Copyright 2018 Mike Chambers

Released under and MIT License

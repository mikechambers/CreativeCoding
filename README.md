GenerativeArt
=============

Mike Chambers  
http://www.mikechambers.com  
mikechambers@gmail.com  

This is a repository of my generative art / creative coding projects, all released under an MIT license. You can view examples of images and videos created with the code on my [instagram account](https://www.instagram.com/mesh2325/).

Code is in various states of quality and usability. I am sharing as there may be useful bits that others can re-use and / or learn from.

These are my personal projects, and generally were not created for sharing, and thus have various levels of documentation and support.

Most of the projects are built around re-usable libraries that I created, and this is where you will probably find some of the most useful bits. 

## Projects

Projects are organized by frameworks which they leverage.

### openframeworks

Projects using the [openFrameworks](http://openframeworks.cc/) C++ library. All of my projects were compiled using XCode on Mac.

Look in *lib/mesh/* for reusable library code,

### paperjs

Browser based projects leveraging [Paper.js](http://paperjs.org/).

Couple of notes:

* In general, projects run on Chrome browser and may leverage Chrome specific features.
* Most need to be [loaded via http](http://www.mikechambers.com/blog/2012/04/08/simple-http-server-for-local-testing/) and wont work when loaded directly from the filesystem.
* Some may require that specific flags be set in Chrome, although this may not be documented well.

Projects are created by copying *_projecttemplate* to a new folder and then editing the *_scripts/main.js* file. Reusable libraries can be found in the *_scripts/mesh* folder.

Some of the projects also use [chroma.js](https://github.com/gka/chroma.js/) which is included.

### processing

Desktop based projects using the [Processing](https://processing.org/) runtime and language.

Almost all of these examples require my [fork of Processing](https://github.com/mikechambers/processing) which adds support for file includes. You can find more info on the full in my (rejected) [pull request](https://github.com/processing/processing/issues/2788).

Reusable libraries are found in the *includes/* folder.


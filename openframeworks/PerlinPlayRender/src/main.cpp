/*
	Copyright Mike Chambers 2018
	mikechambers@gmail.com

	http://www.mikechambers.com
	https://github.com/mikechambers/CreativeCoding

	Released un an MIT License
	https://github.com/mikechambers/CreativeCoding/blob/master/LICENSE.txt
*/

#include "ofMain.h"
#include "ofApp.h"

//========================================================================
int main( ){
	ofSetupOpenGL(800,640,OF_WINDOW);			// <-------- setup the GL context

	// this kicks off the running of my app
	// can be OF_WINDOW or OF_FULLSCREEN
	// pass in width and height too:
	ofRunApp(new ofApp());

}

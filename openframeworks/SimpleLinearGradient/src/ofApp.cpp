/*
    Copyright Mike Chambers 2018
    mikechambers@gmail.com

    http://www.mikechambers.com
    https://github.com/mikechambers/CreativeCoding

    Released un an MIT License
    https://github.com/mikechambers/CreativeCoding/blob/master/LICENSE.txt
*/

#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Canvas.h"
#include "SimpleLinearGradient.h"
#include "MeshUtils.h"

string SAVE_PATH = ofFilePath::getUserHomeDir() + "/screenshots/";
string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

ofxSyphonServer syphon;

ofRectangle windowBounds;
ofRectangle canvasBounds;

ofVec3f center;

Canvas canvas;

SimpleLinearGradient gradient;

//--------------------------------------------------------------
void ofApp::setup(){
    syphon.setName(APP_NAME);

    windowBounds = ofGetWindowRect();
    canvasBounds = ofRectangle(0,0, 640, 640);
    center = canvasBounds.getCenter();
    
    ofColor backgroundColor = ofColor::fromHex(0xFFFFFF);

    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);

    canvas.allocate(canvasBounds, backgroundColor);

    gradient = SimpleLinearGradient(ofColor::orange, ofColor::yellow);
    gradient.setBounds(canvasBounds);
    
    init();
}

void ofApp::init() {
    canvas.reset();
    
    canvas.begin();
    gradient.draw();
    canvas.end();
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    canvas.draw(windowBounds);
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    canvas.draw(windowBounds);
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if(key == 's') {
        canvas.saveImage(SAVE_PATH + APP_NAME);
    } else if(key == 'n') {
        init();
    }
}


//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

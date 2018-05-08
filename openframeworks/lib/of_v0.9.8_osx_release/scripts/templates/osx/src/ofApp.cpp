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

string SAVE_PATH = ofFilePath::getUserHomeDir() + "/screenshots/";
string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

ofxSyphonServer syphon;

ofRectangle windowBounds;
ofRectangle canvasBounds;

ofVec3f center;

Canvas canvas;

//--------------------------------------------------------------
void ofApp::setup(){
    syphon.setName(APP_NAME);

    windowBounds = ofGetWindowRect();
    canvasBounds = ofRectangle(0,0, windowBounds.width * 2, windowBounds.height * 2);
    center = canvasBounds.getCenter();
    
    ofColor backgroundColor = ofColor::fromHex(0x424242);

    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);

    canvas.allocate(canvasBounds, backgroundColor);

    init();
}

void ofApp::init() {
    canvas.reset();
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
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

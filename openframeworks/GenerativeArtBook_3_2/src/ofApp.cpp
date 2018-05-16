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

int const SCALE = 2;

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
    canvasBounds = ofRectangle(0,0, windowBounds.width * SCALE, windowBounds.height * SCALE);
    center = canvasBounds.getCenter();
    
    ofColor backgroundColor = ofColor::fromHex(0x111111);

    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);

    canvas.allocate(canvasBounds, backgroundColor);

    init();
}

void ofApp::init() {
    canvas.reset();
    
    ofPath path;
    path.setStrokeWidth(5);
    path.setStrokeColor(ofColor::white);
    path.setFilled(true);
    
    float xstep = 1;
    float ybase = canvasBounds.getCenter().y;
    float width = canvasBounds.width;
    
    path.moveTo(0, ybase);
    
    int power = ofRandom(1, 40);
    int yScale = ofRandom(1, 400);
    
    for(int i = 1; i < width; i += xstep) {
        
        float y = ofMap(i, 1, width, 0, M_PI * 2);
        
        path.lineTo(i, ybase + pow(sin(y), power) * yScale);
    }
    
    path.lineTo(canvasBounds.getTopRight());
    path.lineTo(canvasBounds.getTopLeft());
    
    canvas.begin();
    
    path.draw();
    
    canvas.end();

    
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

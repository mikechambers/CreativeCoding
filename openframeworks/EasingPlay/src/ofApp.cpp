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
#include "PointTween.h"
#include "TweenMover.h"

string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

MeshUtils utils;
ofxSyphonServer syphon;
ofRectangle bounds;
ofVec3f center;

TweenMover mover;

ofVboMesh mesh;
vector <ofVec3f> points;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::fromHex(0x333333));

    mover.position = bounds.getCenter();
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    
    center = bounds.getCenter();
    
    points.push_back(center);
    
    mesh.addVertex(center);
    
    init();
}

void ofApp::init() {
    
    ofVec3f center = bounds.getCenter();
    ofVec3f startPosition = center;
    startPosition.y = 0;
    
    /*
    tween.setTween(startPosition,
                   center,
                   1000,
                   ofxeasing::Function::Bounce,
                   ofxeasing::Type::Out,
                   500);
    tween.start();
     */
    
    mover.update();
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }

    mover.update();
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofFill();
    ofSetColor(ofColor::white);
    ofDrawCircle(mover.position, 4);
    
    mesh.draw();
    
    for(auto point : points) {
        ofDrawCircle(point, 1);
    }
    
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if (key = 'x') {
        mover.start();
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
    ofVec3f p = ofVec3f(x, y);
    mover.addDestination(p);
    
    points.push_back(p);
    mesh.addVertex(p);
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

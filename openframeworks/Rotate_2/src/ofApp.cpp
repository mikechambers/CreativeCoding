#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Follower.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "APP_NAME";

bool paused = false;

Follower follower;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName("APP_NAME");
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    init();
}

void ofApp::init() {
    follower.setBounds(ofGetWindowRect());
    follower.mass = 10;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    follower.update(ofVec3f(ofGetMouseX(), ofGetMouseY(), 0.0));
    follower.checkBounds();
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofSetColor(ofColor::black);
    ofNoFill();
    
    ofPushMatrix();
        ofTranslate(follower.location.x, follower.location.y);
    
    
        ofPushMatrix();
            ofRotate(follower.angle, 0, 0, 1);
            ofDrawRectangle(0.0, 0.0, follower.mass * 2, follower.mass);
        ofPopMatrix();
    ofPopMatrix();
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
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

#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "APP_NAME";

bool paused = false;

ofVec3f p1;
ofVec3f p2;
float lineLength = 100;

float angle = 0;
float aVelocity = 0;
float aAcceleration = 0.001;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName("APP_NAME");
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    init();
}

void ofApp::init() {
    p1.x = -lineLength;
    p2.x = lineLength;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    aVelocity += aAcceleration;
    angle += aVelocity;
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofSetColor(ofColor::black);
    ofFill();
    
    ofPushMatrix();
    ofTranslate((ofGetWidth() / 2), ofGetHeight() / 2, 0);
    
        ofPushMatrix();
    
            ofRotate(angle, 0, 0, 1);
    
            ofDrawCircle(p1, 5.0);
            ofDrawCircle(p2, 5.0);
            ofDrawLine(p1, p2);
            ofPopMatrix();
    
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

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
#include "BoundsMover.h"
#include "Follower.h"
#include "MouseMover.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "MoverRefactorWork";

ofRectangle bounds;

BoundsMover bMover;
Follower follower;
MouseMover mouseMover;
Mover anchor;
Follower spring;

bool paused = false;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 'p');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    bMover.velocity = mGetRandomVelocity();
    bMover.position = mGetRandomPointInBounds(bounds);
    bMover.maxVelocity = 10;
    bMover.bounds = bounds;
    
    follower.position = mGetRandomPointInBounds(bounds);
    follower.target = &bMover;
    follower.maxVelocity = 5;
    follower.attractionCoefficient = 0.3;
    
    anchor.position = bounds.getCenter();
    
    spring.position = anchor.position;
    spring.friction = 0.02;
    spring.target = & anchor;
    
    mouseMover.mass = 100;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    float dist = (mouseMover.position - spring.position).length();
    if(dist < 20) {
        ofVec3f force = mouseMover.repel(spring);
        spring.applyForce(force);
    }
    
    bMover.update();
    follower.update();
    mouseMover.update();
    spring.update();
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofFill();
    ofSetColor(ofColor::black);
    ofDrawCircle(bMover.position, 4);
    
    ofDrawCircle(anchor.position, 2);
    ofDrawCircle(spring.position, 2);
    
    ofDrawLine(anchor.position, spring.position);
    
    ofNoFill();
    ofDrawCircle(follower.position, 2);
    
    ofSetColor(ofColor::red);
    ofDrawCircle(mouseMover.position, 2);

    
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

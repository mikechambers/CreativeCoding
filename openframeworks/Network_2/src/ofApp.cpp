#include "ofApp.h"
#include "MeshUtils.h"

MeshUtils utils;

float const BOUNDS_PADDING = 100.0;
float const POINT_COUNT = 100000;


ofRectangle bounds;
vector<ofVec3f>points;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_2");
    
    ofSetBackgroundColor(ofColor::white);

    bounds = MeshUtils::getBoundsWithPadding(ofGetWindowRect(), BOUNDS_PADDING);
    points = MeshUtils::getRandomPointsInBounds(bounds, POINT_COUNT);
}

//--------------------------------------------------------------
void ofApp::update(){

}

//--------------------------------------------------------------
void ofApp::draw(){
    
    
    ofSetColor(ofColor::white);
    ofFill();
    ofDrawRectangle(bounds);
    
    
    ofSetColor(ofColor::black);
    ofFill();
    for(int i = 0; i < POINT_COUNT; i++) {
        ofDrawCircle(points[i], 1.0);
    }
    
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

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

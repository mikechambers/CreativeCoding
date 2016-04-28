#include "ofApp.h"
#include "MeshUtils.h"

MeshUtils utils;

float const BOUNDS_PADDING = 100.0;
float const POINT_COUNT = 50;


ofRectangle bounds;
vector<ofVec3f>points;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_2");
    
    /*
    ofRectangle _b = ofGetWindowRect();
    float _x = _b.x + BOUNDS_PADDING;
    float _width = _b.width - (BOUNDS_PADDING * 2);
    float _y = _b.y + BOUNDS_PADDING;
    float _height = _b.height - (BOUNDS_PADDING * 2);
     */

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
        ofDrawCircle(points[i], 2.0);
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

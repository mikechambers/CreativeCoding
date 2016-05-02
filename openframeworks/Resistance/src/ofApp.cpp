#include "ofApp.h"
#include "Mover.h"
#include "VectorUtils.h"

float const DRAG_COEFFICIENT = 0.3;
float const GRAVITY_COEFFICIENT = 0.1;

ofRectangle fluid;
Mover mover;


//--------------------------------------------------------------
void ofApp::setup(){

    fluid.y = ofGetHeight() / 2;
    fluid.height = ofGetHeight() / 2;
    fluid.width = ofGetWidth();
    
    mover.mass = 10.0;
    mover.location.set(ofGetWidth() / 2, mover.mass * 2);
    mover.setBounds(ofGetWindowRect());
    
    ofSetBackgroundColor(ofColor::white);
}

//--------------------------------------------------------------
void ofApp::update(){
    mover.update();
    
    ofVec3f gravity = ofVec3f(0.0, GRAVITY_COEFFICIENT * mover.mass, 0.0);
    
    mover.applyForce(gravity);
    
    ofVec3f l = mover.location;
    if(l.x > fluid.x
       && l.x < fluid.x + fluid.width
       && l.y > fluid.y
       && l.y < fluid.y + fluid.height) {
        
        mover.applyForce(VectorUtils::calculateDrag(mover, DRAG_COEFFICIENT));
    }
    
    mover.checkBounds();
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofSetColor(ofColor::darkGray);
    ofFill();
    ofDrawRectangle(fluid);
    
    ofSetColor(ofColor::black);
    ofDrawCircle(mover.location, mover.mass);
    
    

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

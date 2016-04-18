#include "ofApp.h"

ofEasyCam cam = ofEasyCam();
ofFbo fbo;

ofRectangle viewport;
bool hasRendered = false;

//--------------------------------------------------------------
void ofApp::setup(){
    
    ofSetWindowShape(500,500);
    //cam.setDistance(100);
    //cam.setPosition(150,150,500);
    
    cam.setupPerspective();
    cam.enableOrtho();
    //cam.setDistance(5000);
    
    viewport = ofGetCurrentViewport();
    
    fbo.allocate(500, 500, GL_RGBA);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    if(hasRendered) {
        return;
    }
    
    fbo.begin();
        
        int side = 10;
        int cols = ofGetWindowWidth() / side;
        int rows = ofGetWindowHeight() / side;
    
        for(int i = 0; i < rows; i++) {
            for(int k = 0; k < cols; k++) {
                ofSetColor(ofRandom(0,255), ofRandom(0,255), ofRandom(0,255));
                ofFill();
                ofDrawPlane(side * k - ofGetWindowWidth() / 2, side * i - ofGetWindowHeight() / 2, ofRandom(-50, 50), side, side);
            }
        }
    
    fbo.end();
    
    hasRendered = true;
    
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    //cam.setupPerspective();
    //cam.begin(viewport);
    cam.begin(ofGetCurrentViewport());
    
    fbo.draw(0,0);
    
    cam.end();
    
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

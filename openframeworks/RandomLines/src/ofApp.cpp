#include "ofApp.h"

ofVboMesh mesh;

bool hasRendered = false;
ofEasyCam cam;

//--------------------------------------------------------------
void ofApp::setup(){
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    mesh.enableColors();
    
    cam.enableOrtho();
}

//--------------------------------------------------------------
void ofApp::update(){

    if(hasRendered) {
        return;
    }
    
    mesh.clear();
    
    
    int width = ofGetWindowWidth();
    int height = ofGetWindowHeight();
    
    int numPoints = 10;
    
    for (int i = 0; i < numPoints; i++) {
        //ofPoint point = ofPoint(
        
        float x = ofRandom(0, width);
        float y = ofRandom(0, height);
        float z = ofRandom(0, width);
        
        ofVec3f v(x, y, z);
        
        mesh.addVertex(v);
        ofColor c = ofColor(ofColor(255,255,255), 25);
        mesh.addColor(c);
    }
    
    hasRendered = true;
    
    ofBackground(0, 0, 0);
    ofSetBackgroundAuto(false);
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    
    cam.begin();
    
    ofPushMatrix();
    
    ofTranslate(ofGetWidth() / -2, ofGetHeight() / -2);
    
    //ofBackground(0, 0, 0);
    mesh.draw();
    
    ofPopMatrix();
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

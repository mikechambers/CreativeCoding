#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "GiftWrap";
const int ALPHA = 1.0 * 255;

bool paused = false;

vector<ofVec3f> points;

ofRectangle bounds;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName(APP_NAME);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    init();
}

void ofApp::init() {
    
    bounds = meshGetBoundsWithPadding(ofGetWindowRect(), 100);
    points = meshGetRandomPointsInBounds(bounds, 100);
}


vector<ofVec3f>pointsOnHull;
ofPath path;

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    vector<ofVec3f>pointsOnHull = mFindConvexHull(points);
    
    int pSize = pointsOnHull.size();
    
    path.moveTo(pointsOnHull[0]);
    
    for(int i = 1; i < pSize; i++) {
        path.lineTo(pointsOnHull[i]);
    }
    
    path.close();
    path.setStrokeColor(ofColor(ofColor::black, ALPHA));
    path.setFillColor(ofColor(ofColor::black, ALPHA));
    path.setFilled(false);
    path.setStrokeWidth(1.0);
  
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofSetColor(ofColor::black);
    ofFill();
    
    vector<ofVec3f>::iterator it = points.begin();
    
    for(; it != points.end(); ++it){
        ofDrawCircle((*it), 2.0);
    }
    
    path.draw();
    
    
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

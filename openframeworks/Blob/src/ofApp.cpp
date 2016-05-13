#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "Follower.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Blob";
const int FOLLOWER_COUNT = 10000;
const int RADIUS = 25;
const int ALPHA = 1.0 * 255;

bool paused = true;

vector<Follower> followers;
Mover centerMover;

ofPath path;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName(APP_NAME);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::black);
    
    init();
}

void ofApp::init() {
    
    ofRectangle bounds = ofGetWindowRect();
    ofVec3f center = mGetWindowCenterPoint();
    
    centerMover.setBounds(bounds);
    centerMover.location.set(center);
    centerMover.setToRandomVelocity(1.5);
    
    for(int i = 0; i < FOLLOWER_COUNT; i++) {
        Follower f;
        f.setBounds(bounds);
        f.setTarget(&centerMover);
        f.location.set(mGetRandomPointInCircle(center, RADIUS));
        //f.attractionCoefficient = 0.05;
        
        followers.push_back(f);
    }
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    path.clear();
    
    centerMover.update();
    centerMover.checkBounds();
    
    vector<ofVec3f>ps;
    
    for(int i = 0; i < FOLLOWER_COUNT; i++) {
        followers[i].update();
        followers[i].checkBounds();
        ps.push_back(followers[i].location);
    }
    
    vector<ofVec3f>hullPoints = mFindConvexHull(ps);
    
    
    int size = hullPoints.size();
    for(int i = 0; i < size; i++) {
        if(i == 0) {
            path.moveTo(hullPoints[i]);
        } else {
            path.lineTo(hullPoints[i]);
        }
    }
    
    path.close();
    path.setStrokeColor(ofColor(ofColor::white, ALPHA));
    path.setFillColor(ofColor(ofColor::white, ALPHA));
    path.setFilled(true);
    path.setStrokeWidth(2.0);
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
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

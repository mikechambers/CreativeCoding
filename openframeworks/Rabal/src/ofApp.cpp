#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "Follower.h"
#include "VectorUtils.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Rabel";

int const ALPHA = 1.0 * 255;
int const POINT_COUNT = 180;
int const RADIUS = 100;
vector<Follower>points;

ofVec3f center;
Mover core;
Mover mouse;

ofPath blobPath;

bool paused = true;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName(APP_NAME);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::black);
    
    init();
}

void ofApp::init() {
    
    mouse.location.set(ofGetMouseX(), ofGetMouseY());
    mouse.mass = 10.0;
    
    center = meshGetCenterPoint();
    core.location = center;
    core.mass = 150;
    //core.minGravityInfluence = 1.0;
    //core.maxGravityInfluence = 5000.0;
    //core.gravity_coefficient = 0.8;
    
    for(int i = 0; i < POINT_COUNT; i++) {
        Follower m;
        m.setBounds(ofGetWindowRect());
        
        float angle = ofDegToRad(ofMap(i, 0, POINT_COUNT, 0, 360));
        
        m.location = meshGetPointOnCircle(center, RADIUS, angle);
        m.setTarget(&core);
        
        points.push_back(m);
    }
    
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    blobPath.clear();
    
    mouse.location.set(ofGetMouseX(), ofGetMouseY());
    
    bool doMouseInfluence = (mouse.location.x > 0 && mouse.location.x < ofGetHeight() &&
                                        mouse.location.y > 0 && mouse.location.y < ofGetWidth());
    
    vector<Follower>::iterator it = points.begin();
    
    for(; it != points.end(); ++it){
        
        Follower &m = (*it);
        m.applyForce(core.repel(m));
        

        if(doMouseInfluence) {
            m.applyForce(mouse.repel(m));
        }
        
        m.update();
        m.checkBounds();
        
        if(it == points.begin()) {
            blobPath.moveTo(m.location);
        } else {
            blobPath.curveTo(m.location);
        }
    }
    
    blobPath.close();
    blobPath.setStrokeColor(ofColor(ofColor::white, ALPHA));
    blobPath.setFillColor(ofColor(ofColor::white, ALPHA));
    blobPath.setFilled(true);
    blobPath.setStrokeWidth(1.0);
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    blobPath.draw();
    
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

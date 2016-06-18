#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "Follower.h"
#include "QuadraticCurve.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Blob";
const int FOLLOWER_COUNT = 10;
const int RADIUS = 200;
const int ALPHA = 1.0 * 255;

bool paused = true;

#define NULL_VEC_X -9999999

vector<Follower> followers;
Mover centerMover;

vector<QuadraticCurve> segments;

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


ofVec3f _lastCp = ofVec3f(NULL_VEC_X, 0, 0);

void ofApp::update(){
    if(paused) {
        return;
    }
    
    path.clear();
    segments.clear();
    
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
    for(int i = 0; i < size + 1; i++) {
        //if(i == 0) {
        //    path.moveTo(hullPoints[i]);
        //} else {
            //path.lineTo(hullPoints[i]);
        
        ofVec3f cp;
        if(i == size) {
            cp = hullPoints[0];
        } else {
            cp = hullPoints[i];
        }
            
        if(_lastCp.x == NULL_VEC_X) {
            _lastCp = cp;
            continue;
        }
        
        QuadraticCurve currentCurve;
        
        currentCurve.cp = _lastCp;
        
        if(segments.size() > 0) {
            QuadraticCurve _tmp = segments[segments.size() - 1];
            currentCurve.p1 = _tmp.p2;
        } else {
            currentCurve.p1 = _lastCp.interpolate(cp, 0.5);
        }
        
        currentCurve.p2 = _lastCp.interpolate(cp, 0.5);
        
        segments.push_back(currentCurve);
        
        _lastCp = cp;
            
       // }
    }
    

    int len = segments.size();
    
    for(int i = 0; i < len; i++) {
        QuadraticCurve c = segments[i];
        
        
        if(i == 0) {
            path.moveTo(c.p1);
        } else {
            path.quadBezierTo(c.p1, c.cp, c.p2);
        }
        
        //path.quadBezierTo(c.p1, c.cp, c.p2);
        
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

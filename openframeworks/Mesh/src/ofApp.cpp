#include "ofApp.h"
#include "Mover.h"
#include "MeshUtils.h"
#include "ForceInfluencer.h"

MeshUtils utils;
ofVboMesh mesh;

int const COL_COUNT = 10;
int const ROW_COUNT = 10;
int const SPACING = 25;

ForceInfluencer influencer;

ofVec3f origin;

vector<Mover>movers;


//--------------------------------------------------------------
void ofApp::setup(){
    
    influencer.influenceRadius = 60;
    influencer.minForce = 0.001;
    influencer.maxForce = 0.05;
    influencer.forceType = ForceType::ATTRACT;
    
    utils.enableScreenShot("Mesh");
    ofBackground(ofColor::black);
    
    int x = (ofGetWidth() - (COL_COUNT * SPACING)) / 2;
    int y = (ofGetHeight() - (ROW_COUNT * SPACING)) / 2;
    
    origin.set(x, y, 0.0);
    
    for(int i = 0; i < ROW_COUNT; i++) {
        for(int k = 0; k < COL_COUNT; k++) {
            Mover m;
            m.setBounds(ofGetWindowRect());
            m.location.set(k * SPACING, i * SPACING);
            m.location += origin;
            movers.push_back(m);
        }
    }
}

//--------------------------------------------------------------
void ofApp::update(){
    influencer.location.set(ofGetMouseX(), ofGetMouseY(), 0.0);
    
    vector<Mover>::iterator it = movers.begin();
    
    for(; it != movers.end(); ++it) {
        Mover &m = *it;
        m.applyForce(influencer.influence(m));
        m.update();
    }
    

}

//--------------------------------------------------------------
void ofApp::draw(){
    
    
    //ofPushMatrix();
    //ofTranslate(ofGetWidth() / -2, ofGetHeight() / -2);
    
    ofSetColor(ofColor::white);
    ofFill();
    
    vector<Mover>::iterator it = movers.begin();
    
    for(; it != movers.end(); ++it) {
        Mover &m = *it;
        ofDrawCircle(m.location, 1.0);
    }
    
    ofNoFill();
    ofSetColor(ofColor(ofColor::white, 128));
    
    ofDrawCircle(influencer.location, influencer.influenceRadius);
    
    //ofPopMatrix();
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

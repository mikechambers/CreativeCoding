#include "ofApp.h"
#include "Mover.h"
#include "ForceInfluencer.h"
#include "MeshUtils.h"

MeshUtils utils;

vector<ForceInfluencer>influencers;

Mover mover;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot("Gravity");
    
    int count = 4;
    int rows = count / 2;
    int cols = count / 2;
    
    for(int c = 0; c < cols; c++) {
        for(int r = 0; r < rows; r++){
            ForceInfluencer inf;
            inf.location.y = ((ofGetHeight() / rows) * r) + ofGetWidth() / count;
            inf.location.x = ((ofGetWidth() / cols) * c) + ofGetHeight() / count;
            inf.mass = ofRandom(2.0, 100.0);
            
            if(ofRandomf() > 0.2) {
                inf.forceType = ATTRACT;
            } else {
                inf.forceType = REPEL;
            }
            
            influencers.push_back(inf);
        }
    }
    
    mover.setBounds(ofGetWindowRect());
    mover.setToRandomLocation();
    mover.setToRandomVelocity(5.0);
    mover.mass = 2.0;
    
    ofSetBackgroundColorHex(0x111111);
}

//--------------------------------------------------------------
void ofApp::update(){

    vector<ForceInfluencer>::iterator it = influencers.begin();  // create an iterator that points to the first element
    for(; it != influencers.end(); ++it){
        mover.applyForce((*it).influence(mover));
    }
    
    mover.update();
    mover.checkBounds();
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofSetColor(ofColor::white);
    ofNoFill();
    
    vector<ForceInfluencer>::iterator it = influencers.begin();  // create an iterator that points to the first element
    for(; it != influencers.end(); ++it){
        
        if((*it).forceType == ATTRACT) {
            ofFill();
        } else {
            ofNoFill();
        }
        
        ofDrawCircle((*it).location, (*it).mass);
    }
    
    ofFill();
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

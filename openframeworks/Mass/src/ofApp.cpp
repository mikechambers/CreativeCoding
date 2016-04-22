#include "ofApp.h"
#include "Mover.h"

int const MOVER_COUNT = 20;
float const INFLUENCE_RADIUS = 140;
float const MAX_VELOCITY = 2.0;
float const MAX_MASS = 20.0;
float const REPEL = false;


ofVec3f wind(0.0, 0.0, 0.0);
ofVec3f gravity(0.0, 0.001, 0.0);
ofVec3f repelPoint;

vector<Mover> movers;


//--------------------------------------------------------------
void ofApp::setup(){
    
    repelPoint = ofVec3f(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
    
    for(int i = 0; i < MOVER_COUNT; i++) {
        
        Mover mover;
        mover.setBounds(ofGetWindowRect());//maybe default this in the class?
        mover.setToRandomLocation();
        mover.setToRandomVelocity(MAX_VELOCITY);
        mover.mass = ofRandom(0.0, MAX_MASS);
        
        movers.push_back(mover);
    }
    
}

void ofApp::checkRepel(Mover * mover) {

    float distance = mover->location.distance(repelPoint);
    
    if(distance > INFLUENCE_RADIUS) {
        return;
    }
    
    ofVec3f f = repelPoint - mover->location;
    f.normalize();
    f *= (ofMap(distance, 0, INFLUENCE_RADIUS, 0.01, 0.5));
    
    if(REPEL) {
        f *= -1;
    }
    
    mover->applyForce(f);
}


//--------------------------------------------------------------
void ofApp::update(){
    
    vector<Mover>::iterator it = movers.begin();
    
    for(; it != movers.end(); ++it){
        Mover &m = *it;
        m.applyForce(gravity + wind);
        
        checkRepel(&m);
        
        m.update();
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofSetColor(ofColor::white);
    ofFill();
    
    vector<Mover>::iterator it = movers.begin();
    
    for(; it != movers.end(); ++it){
        Mover &m = *it;        
        ofDrawCircle(m.location, m.mass);
    }
    
    
    ofDrawCircle(repelPoint.x, repelPoint.y, 2);
    
    ofNoFill();
    ofDrawCircle(repelPoint.x, repelPoint.y, INFLUENCE_RADIUS);
    
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
    Mover m;
    m.location.set(x, y, 0.0);
    m.velocity.set(0.0, 1.0, 0.0);
    m.mass = ofRandom(20.0);
    m.setBounds(ofGetWindowRect());
    
    movers.push_back(m);
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

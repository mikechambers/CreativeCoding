/*
    Copyright Mike Chambers 2018
    mikechambers@gmail.com

    http://www.mikechambers.com
    https://github.com/mikechambers/CreativeCoding

    Released un an MIT License
    https://github.com/mikechambers/CreativeCoding/blob/master/LICENSE.txt
*/

#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "Spring.h"
#include "Group.h"

MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Spring";
bool paused = false;

ofRectangle bounds;

Mover mouseMover;

vector<Group> groups;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    

    int GRID_SIZE = 20;
    for(int y = 0; y < (bounds.height / GRID_SIZE) - 1; y++) {
        for(int x = 0; x < (bounds.width / GRID_SIZE) - 1; x++) {
        
            ofVec3f l;
            l.x = (x +  1) * GRID_SIZE;
            l.y =  (y + 1) * GRID_SIZE;
            
            Group g;
            g.init(l);
            
            groups.push_back(g);
        }
    }

    
    mouseMover.mass = 100;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    //for(auto group : groups) {
    vector<Group>::iterator it = groups.begin();
    for(; it != groups.end(); ++it){
        Group &group = *it;
        
        float dist = (mouseMover.location - group.spring.location).length();
        if(dist < 20) {
            ofVec3f force = mouseMover.repel(group.spring);
            
            //float mod = ((20 - dist) / 20);
            //spring.applyForce(force * mod);
            group.spring.applyForce(force);
        }

        group.spring.update();
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    vector<Group>::iterator it = groups.begin();
    for(; it != groups.end(); ++it){
        Group &group = *it;
        
        ofFill();
        ofSetColor(ofColor(ofColor::black,  36));
        ofDrawCircle(group.anchor.location, 2);
        
        ofDrawLine(group.anchor.location, group.spring.location);
        
        ofSetColor(group.color);
        ofDrawCircle(group.spring.location, 4);
    }

    ofNoFill();
    ofDrawCircle(mouseMover.location, 20);
    
    
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
    mouseMover.location.x = x;
    mouseMover.location.y = y;
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

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
#include "Follower.h"
#include "MouseMover.h"
#include "Group.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "CircleAgain";

const  int MASS = 50;
const bool SCALE_GRAVITY = false;

const string FONT_PATH = "/Users/mesh/SFCompactDisplay-Heavy.otf";

ofRectangle bounds;

bool paused = false;

vector<shared_ptr<Group>> groups;

MouseMover mouseMover;

ofVboMesh mesh;
ofTrueTypeFont font;

string phrase = "code is beautiful ";

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);
    
    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    font.load(FONT_PATH, 32);
    
    mouseMover.mass = MASS;
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_LOOP);
    
    ofVec3f center  = bounds.getCenter();
    int RADIUS = 100;
    
    float start = (M_PI);
    for(float i = start; i < M_PI * 2 + M_PI; i += ((M_PI * 2 )/ phrase.length())) {
        ofVec3f p = mGetPointOnCircle(center, RADIUS, i);
        
        shared_ptr<Group> g(new Group());
        
        g->init(p);
        
        groups.push_back(g);
    }
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    mouseMover.update();
    
    mesh.clear();
    
    for(auto& group : groups) {
        
        float dist = (mouseMover.position - group->spring.position).length();
        if(dist < MASS) {
            ofVec3f force = mouseMover.repel(group->spring);

            if(SCALE_GRAVITY) {
                float mod = ((MASS - dist) / MASS);
                group->spring.applyForce(force * mod);
            } else {
                group->spring.applyForce(force);
            }
        }
        
        group->spring.update();
        
        mesh.addColor(ofColor::black);
        mesh.addVertex(group->spring.position);
    }
    
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    //mesh.draw();
    
    ofSetColor(ofColor::black);
    int index = 0;
    for(auto& group : groups) {
        //ofDrawBitmapString(phrase[index], group->spring.position);
        font.drawString(ofToString(phrase[index]),
                        group->spring.position.x,
                        group->spring.position.y);
        index++;
    }
    
    ofNoFill();
    ofSetColor(ofColor(ofColor::darkSlateGray), 128);
    ofDrawCircle(mouseMover.position, MASS);
    
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

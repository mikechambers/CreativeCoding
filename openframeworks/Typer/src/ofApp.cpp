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
int letterIndex = 0;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);
    
    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::fromHex(0x333333));
    
    font.load(FONT_PATH, 32,true, true, true);
    
    mouseMover.mass = MASS;
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_LOOP);
    
    ofVec3f center  = bounds.getCenter();
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
    
    
    int index = 0;
    ofNoFill();
    for(auto& group : groups) {
        ofSetColor(ofColor::white);
        font.drawStringAsShapes(ofToString(group->letter),
                        group->spring.position.x,
                        group->spring.position.y);
        index++;
    }
    
    
    //ofSetColor(ofColor(ofColor::darkSlateGray), 128);
    //ofDrawCircle(mouseMover.position, MASS);
    
    syphon.publishScreen();
}

int row = 0;
//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
    ofRectangle writingBounds = mGetBoundsWithPadding(bounds,40);
    
    float xPos = letterIndex * 32;
    
    if(xPos > writingBounds.width)  {
        row++;
        xPos = 0;
        letterIndex = 1;
    } else {
        letterIndex++;
    }
    
    
    ofVec3f anchorPosition = ofVec3f(writingBounds.x + xPos, writingBounds.y + (row * 64));
    ofVec3f startPosition = ofVec3f(bounds.width / 2, bounds.height);
    
    
    
    shared_ptr<Group> g(new Group());
    g->init(anchorPosition, startPosition, key);
    groups.push_back(g);
    
    /*
    if(key == ' ') {
        paused = !paused;
    }
     */
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

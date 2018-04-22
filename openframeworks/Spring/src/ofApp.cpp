/*
    Copyright Mike Chambers 2018
    mikechambers@gmail.com

    http://www.mikechambers.com
    https://github.com/mikechambers/CreativeCoding

    Released under an MIT License
    https://github.com/mikechambers/CreativeCoding/blob/master/LICENSE.txt
*/

#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "Follower.h"
#include "PointFollower.h"
#include "Group.h"

MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Spring";

bool paused = false;

const bool DRAW_GUIDES = false;

const int GRID_SIZE = 2;
const float MAX_VELOCITY = 10;
const int POINT_COUNT = 30;
const bool RANDOM_POINTS = true;
const int PATH_JITTER = 50;
const int MASS = 25;
const bool SCALE_GRAVITY  = true;
const int POINT_OPACITY = 30;
const float FRICTION = 0.03;
const int POINT_SIZE = 2;
const int PADDING = 20;

ofRectangle bounds;

ofVboMesh lineMesh;

PointFollower pointFollower;
Follower follower;

vector<shared_ptr<Group>> groups;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofColor c = mRandomColor();
    ofSetBackgroundColor(c);
    
    cout << mColorToString(c) << endl;
    
    lineMesh.enableColors();
    lineMesh.setMode(OF_PRIMITIVE_LINES);
    
    vector<ofVec3f> points;
    
    points = mGetRandomPointsInBounds(mGetBoundsWithPadding(bounds, PADDING), POINT_COUNT);
    
    pointFollower.setPoints(points);
    pointFollower.position = mGetRandomPointInBounds(bounds);
    pointFollower.position = mGetRandomVelocity(MAX_VELOCITY);
    pointFollower.randomOrder = RANDOM_POINTS;
    pointFollower.pathJitter = PATH_JITTER;
    
    follower.position = mGetRandomPointInBounds(bounds);
    follower.target = &pointFollower;
    follower.attractionCoefficient = 0.2;
    follower.mass = MASS;
    
    for(int y = 0; y < (bounds.height / GRID_SIZE) - 1; y++) {
        for(int x = 0; x < (bounds.width / GRID_SIZE) - 1; x++) {
        
            ofVec3f l;
            l.x = (x +  1) * GRID_SIZE;
            l.y = (y + 1) * GRID_SIZE;
            
            shared_ptr<Group> g(new Group());

            g->init(l);
            g->color = ofColor(ofColor::white, POINT_OPACITY);
            g->spring.friction = FRICTION;
            groups.push_back(g);
        }
    }
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    lineMesh.clear();
    
    pointFollower.update();
    follower.update();
    
    for(auto& group : groups) {
        //Group &group = *it;
        
        float dist = (follower.position - group->spring.position).length();
        if(dist < MASS) {
            ofVec3f force = follower.repel(group->spring);
            
            
            //note, could simplify this a bit by setting mod to
            //1 by default  and then just applying force, but
            //duplicating code to we dont have unecessary vector
            //multiplication when SCALE_GRAVITY is false.
            if(SCALE_GRAVITY) {
                float mod = ((MASS - dist) / MASS);
                group->spring.applyForce(force * mod);
            } else {
                group->spring.applyForce(force);
            }
        }

        group->spring.update();
        
        lineMesh.addColor(ofColor(ofColor::white, 255));
        lineMesh.addVertex(group->anchor.position);
        lineMesh.addColor(ofColor(ofColor::white, 0));
        lineMesh.addVertex(group->spring.position);
        
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    lineMesh.draw();

    for(auto& group : groups) {
        ofFill();
        ofSetColor(ofColor::black);

        ofSetColor(group->color);
        ofDrawCircle(group->spring.position, POINT_SIZE);
    }

    if(DRAW_GUIDES) {
        ofSetColor(ofColor::black);
        ofNoFill();
        ofDrawCircle(follower.position, follower.mass);
        ofDrawCircle(pointFollower.position, 4);
    }
    
    
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

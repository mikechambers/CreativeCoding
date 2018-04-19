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
const int GRID_SIZE = 2;
bool paused = true;

const float MAX_VELOCITY = 10;
const int POINT_COUNT = 30;
const bool RANDOM_POINTS = true;
const int PATH_JITTER = 50;
const int MASS = 100;
const bool DRAW_GUIDES = false;

const int CIRLCE_SIZE = 2;

ofRectangle bounds;

Mover mouseMover;

ofVboMesh lineMesh;

PointFollower pointFollower;
Follower follower;


//vector<Group> groups;
vector<shared_ptr<Group>> groups;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    //ofSetBackgroundColor(ofColor::darkSlateGray);
    
    ofColor c = mRandomColor();
    ofSetBackgroundColor(c);
    
    cout << "ofColor(" << c.r << "," << c.g << "," << c.b << ")" << endl;
    
    lineMesh.enableColors();
    lineMesh.setMode(OF_PRIMITIVE_LINES);
    
    vector<ofVec3f> points;
    
    points = mGetRandomPointsInBounds(bounds, POINT_COUNT);
    
    pointFollower.setPoints(points);
    pointFollower.setToRandomLocation();
    pointFollower.setToRandomVelocity(MAX_VELOCITY);
    pointFollower.randomOrder = RANDOM_POINTS;
    pointFollower.pathJitter = PATH_JITTER;
    
    follower.setToRandomLocation();
    follower.setTarget(&pointFollower);
    follower.attractionCoefficient = 0.2;
    follower.mass = MASS;
    
    for(int y = 0; y < (bounds.height / GRID_SIZE) - 1; y++) {
        for(int x = 0; x < (bounds.width / GRID_SIZE) - 1; x++) {
        
            ofVec3f l;
            l.x = (x +  1) * GRID_SIZE;
            l.y = (y + 1) * GRID_SIZE;
            
            shared_ptr<Group> g(new Group());

            g->init(l);
            g->color = ofColor(ofColor::darkBlue, 30);
            g->spring.friction = 0.03;
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
    
    lineMesh.clear();
    
    pointFollower.update();
    follower.update();
    
    for(auto& group : groups) {
        //Group &group = *it;
        
        float dist = (follower.location - group->spring.location).length();
        if(dist < MASS) {
            ofVec3f force = follower.repel(group->spring);
            
            float mod = ((MASS - dist) / MASS);
            group->spring.applyForce(force * mod);
            //group->spring.applyForce(force);
        }

        group->spring.update();
        
        lineMesh.addColor(ofColor(ofColor::white, 255));
        lineMesh.addVertex(group->anchor.location);
        lineMesh.addColor(ofColor(ofColor::white, 0));
        lineMesh.addVertex(group->spring.location);
        
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
        //ofDrawCircle(group->anchor.location, 2);
        
        //ofDrawLine(group->anchor.location, group->spring.location);
        
        ofSetColor(group->color);
        ofDrawCircle(group->spring.location, CIRLCE_SIZE);
    }

    if(DRAW_GUIDES) {
        ofSetColor(ofColor::black);
        ofDrawCircle(follower.location, 20);
        ofDrawCircle(pointFollower.location, 4);
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

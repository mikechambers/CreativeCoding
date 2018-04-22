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

int GRID_SIZE = 2;
float MAX_VELOCITY = 10;
int POINT_COUNT = 30;
bool RANDOM_POINTS = true;
int PATH_JITTER = 50;
int MASS = 100;
bool SCALE_GRAVITY  = false;
int POINT_OPACITY = 30;
float FRICTION = 0.03;
int POINT_SIZE = 2;
int PADDING = 20;

const int REFRESH_SECONDS =  1;

ofColor pointColor;

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
    
    lineMesh.enableColors();
    lineMesh.setMode(OF_PRIMITIVE_LINES);
    
    vector<ofVec3f> points = mGetRandomPointsInBounds(mGetBoundsWithPadding(bounds, PADDING), POINT_COUNT);
    
    pointFollower.setPoints(points);
    pointFollower.position = mGetRandomPointInBounds(bounds);
    pointFollower.velocity = mGetRandomVelocity(MAX_VELOCITY);
    pointFollower.randomOrder = RANDOM_POINTS;
    pointFollower.pathJitter = PATH_JITTER;
    
    follower.position = mGetRandomPointInBounds(bounds);
    follower.target = &pointFollower;
    follower.attractionCoefficient = 0.2;
    follower.mass = MASS;
    
    init();
}

void ofApp::init() {
    
    GRID_SIZE = int(ofRandom(2,30));
    POINT_COUNT = int(ofRandom(3,30));
    
    MASS = int(ofRandom(50,250));
    POINT_OPACITY = int(ofRandom(10,255));
    
    FRICTION = ofRandom(0.01, 0.004);
    
    POINT_SIZE = int(ofRandom(1,20));

    
    pointColor = mRandomColor(POINT_OPACITY);
    
    lineMesh.clear();
    
    ofColor c = mRandomColor();
    ofSetBackgroundColor(c);
    
    cout << mColorToString(c) << endl;
    
    groups.clear();
    

    
    for(int y = 0; y < (bounds.height / GRID_SIZE) - 1; y++) {
        for(int x = 0; x < (bounds.width / GRID_SIZE) - 1; x++) {
            
            ofVec3f l;
            l.x = (x +  1) * GRID_SIZE;
            l.y = (y + 1) * GRID_SIZE;
            
            shared_ptr<Group> g(new Group());
            
            g->init(l);
            g->color = pointColor;
            g->spring.friction = FRICTION;
            groups.push_back(g);
        }
    }
}

int lastScreenShotTime = 0;
//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    int elapsedTime = int(ofGetElapsedTimef());

    if(lastScreenShotTime != elapsedTime && int(elapsedTime) % REFRESH_SECONDS == 0) {
        utils.takeScreenshot();
        init();
        lastScreenShotTime = elapsedTime;
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

#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "PointFollower.h"
#include "Follower.h"
#include "ImageLoader.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Web";
bool paused = true;

const int OPACITY = 10;
const int CONNECT_DISTANCE = 50;
const float VELOCITY = 10;
const int POINT_COUNT = 30;
const bool RANDOM_POINTS = false;
const int BOUNDS_PADDING = 40;

const string IMG_PATH = "../../../images/tycho_awake.png";

vector <ofPoint> drawnPoints;
vector <Line> lines;

vector<ofVec3f> points;

ofRectangle bounds;

//Mover mover;
Follower follower;
PointFollower pointFollower;

ImageLoader image;

//change movement algorithm to move between points
//change to ofVboMesh

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName(APP_NAME);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    bounds = ofGetWindowRect();
    
    image.load(IMG_PATH);
    image.resize(640, 640);
    
    pointFollower.setToRandomLocation();
    pointFollower.setToRandomVelocity(VELOCITY);
    pointFollower.randomOrder = RANDOM_POINTS;
    
    points = mGetRandomPointsInBounds(mGetBoundsWithPadding(bounds, BOUNDS_PADDING), POINT_COUNT);
    pointFollower.setPoints(points);
    
    follower.setTarget(&pointFollower);
    follower.setToRandomLocation();
    follower.attractionCoefficient = 0.2;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    //mover.checkBounds();
    //mover.update();
    follower.update();
    
    pointFollower.update();
    
    ofPoint mouse = follower.location;
    
    for(auto point : drawnPoints) {
        
        float dist = (mouse - point).length();
        if(dist < CONNECT_DISTANCE) {
            Line lineTemp;
            lineTemp.a = mouse;
            lineTemp.b = point;
            lines.push_back(lineTemp);
        }
    }
    
    drawnPoints.push_back(mouse);
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    //ofEnableAlphaBlending();
    
    ofNoFill();
    ofSetColor(ofColor::red);
    ofDrawCircle(pointFollower.getCurrentPoint(), 12);
    
    ofFill();
    ofSetColor(ofColor::black);
    
    for(auto point : points) {
        ofDrawCircle(point, 1);
    }
    
    for(auto line : lines) {
        ofSetColor(ofColor(image.getColor(line.a), OPACITY));
        ofDrawLine(line.a, line.b);
    }
    
    ofSetColor(ofColor::red);
    ofDrawLine(follower.location, pointFollower.location);
    ofDrawCircle(pointFollower.location, 2);
    ofDrawCircle(follower.location, 2);
    

    
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

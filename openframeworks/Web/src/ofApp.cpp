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

const int OPACITY = 2;
const int CONNECT_DISTANCE = 30;
const float VELOCITY = 10;
const int POINT_COUNT = 30;
const bool RANDOM_POINTS = true;
const int BOUNDS_PADDING = 100;
const bool DRAW_GUIDES = false;
const int PATH_JITTER = 50;

const string IMG_PATH = "../../../images/masks/tree.gif";

vector <ofPoint> drawnPoints;

ofVboMesh lineMesh;
ofVboMesh pointMesh;

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
 
    lineMesh.setMode(OF_PRIMITIVE_LINES);
    lineMesh.enableColors();
    
    pointFollower.setToRandomLocation();
    pointFollower.setToRandomVelocity(VELOCITY);
    pointFollower.randomOrder = RANDOM_POINTS;
    pointFollower.pathJitter = PATH_JITTER;
    
    points = mGetRandomPointsInBounds(mGetBoundsWithPadding(bounds, BOUNDS_PADDING), POINT_COUNT);
    pointFollower.setPoints(points);
    
    pointMesh.setMode(OF_PRIMITIVE_POINTS);
    pointMesh.enableColors();
    
    for(auto point : points ){
        pointMesh.addColor(ofColor::black);
        pointMesh.addVertex(point);
    }
    
    
    
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
            
            lineMesh.addColor(ofColor(image.getColor(mouse), OPACITY));
            lineMesh.addVertex(mouse);
            
            lineMesh.addColor(ofColor(image.getColor(point), OPACITY));
            lineMesh.addVertex(point);
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
    
    
    if(DRAW_GUIDES) {
        pointMesh.draw();
        
        ofNoFill();
        ofSetColor(ofColor::red);
        ofDrawCircle(pointFollower.getCurrentPoint(), 12);
        
        ofFill();
        ofSetColor(ofColor::black);
        
        ofSetColor(ofColor::red);
        ofDrawLine(follower.location, pointFollower.location);
        ofDrawCircle(pointFollower.location, 2);
        ofDrawCircle(follower.location, 2);
    }
    
    lineMesh.draw();

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

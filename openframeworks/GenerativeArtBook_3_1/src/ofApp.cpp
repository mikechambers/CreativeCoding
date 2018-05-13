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
#include "Canvas.h"
#include "MeshUtils.h"
#include "BoundsMover.h"
#include "Follower.h"

string SAVE_PATH = ofFilePath::getUserHomeDir() + "/screenshots/";
string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

ofxSyphonServer syphon;

ofRectangle windowBounds;
ofRectangle canvasBounds;

ofVec3f center;

Canvas canvas;

ofVec3f lastPoint;
bool firstPointDrawn = false;

BoundsMover mover;
Follower follower;

//--------------------------------------------------------------
void ofApp::setup(){
    syphon.setName(APP_NAME);

    windowBounds = ofGetWindowRect();
    canvasBounds = ofRectangle(0,0, windowBounds.width * 2, windowBounds.height * 2);
    center = canvasBounds.getCenter();
    
    ofColor backgroundColor = ofColor::fromHex(0x424242);

    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);

    canvas.allocate(canvasBounds, backgroundColor);
    
    mover.velocity = mGetRandomVelocity(10);
    mover.position = mGetRandomPointInBounds(canvasBounds);
    mover.bounds = canvasBounds;
    
    follower.target = &mover;

    init();
}
float ynoise = 10000;
void ofApp::init() {
    canvas.reset();
    
    return;
    
    ofPath path;
    path.setStrokeColor(ofColor::white);
    path.setFilled(false);
    path.setStrokeWidth(2);
    
    int step = 10;
    float y = 0;
    
    for(int i = 0; i < canvasBounds.width + step; i += step) {
        
        y = center.y + ofNoise(ynoise) * 200;
        ofVec3f p = ofVec3f(i, y);
        
        if(i == 0) {
            path.moveTo(p);
        } else {
            path.lineTo(p);
        }
        
        
        ynoise += 0.1;
    }

    canvas.begin();
    path.draw();
    canvas.end();
}

float xNoise = 10;
float yNoise = 10;
void ofApp::drawLine(ofVec3f p1, ofVec3f p2) {
    
    ofPath path;
    path.setStrokeColor(ofColor::white);
    path.setFilled(false);
    path.setStrokeWidth(2);
    
    float distance = p1.distance(p2);
    
    float scale = 50;
    
    ofVec3f t;
    for(float i = 1; i < distance; i++) {
        
        
        //t = mGetPointOnLine(p1, p2, i);

        t.x = i;
        t.y = (ofNoise(yNoise) * scale) - scale / 2;
        //t.x += (ofNoise(xNoise) * scale) - scale / 2;
        
        path.lineTo(t);
        
        //xNoise += 0.001;
        yNoise += 0.01;
    }

    canvas.begin();
    ofPushMatrix();
    
    float deg = ((mGetAngleOfLine(p1, p2)*180) / M_PI);
    
    ofTranslate(p1.x, p1.y);
    ofRotateZ(deg);
    
    auto modelMatrix = ofGetCurrentMatrix(OF_MATRIX_MODELVIEW) * ofGetCurrentViewMatrix().getInverse();
    ofVec3f dest(0,0,0);
    dest = t * modelMatrix;
    
    lastPoint = dest;
    
    //cout << p1.x << " : " << dest.x << endl;
    
    path.draw();
    ofPopMatrix();
    canvas.end();
    
    //lastPoint = dest;
    
    
    
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    
    mover.update();
    follower.update();
    
    ofVec3f currentPoint = follower.position;
    
    if(!firstPointDrawn) {
        firstPointDrawn = true;
        lastPoint = currentPoint;
    } else {
        drawLine(lastPoint, currentPoint);
    }
     
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    canvas.draw(windowBounds);
    
    ofSetColor(ofColor::white);
    ofDrawCircle(mover.position.x / 2, mover.position.y / 2,  4);
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if(key == 's') {
        canvas.saveImage(SAVE_PATH + APP_NAME);
    } else if(key == 'n') {
        init();
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
    ofVec3f currentPoint = ofVec3f(x * 2, y * 2);
    
    if(!firstPointDrawn) {
        firstPointDrawn = true;
        lastPoint = currentPoint;
    } else {
        drawLine(lastPoint, currentPoint);
    }
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

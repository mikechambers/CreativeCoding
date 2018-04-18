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
#include "ImageLoader.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Node";
const string IMAGE_PATH = "../../../images/gradient_7.jpg";

ofRectangle bounds;

bool paused = false;

ofNode baseNode;
ofNode childNode;
ofNode grandChildNode;
ofVboMesh lineMesh;
ofEasyCam cam;

ImageLoader image;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    image.load(IMAGE_PATH);
    
    lineMesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    lineMesh.enableColors();
    
    bounds = ofGetWindowRect();
    
    ofEnableDepthTest();
    baseNode.setPosition(0,0,0);
    childNode.setParent(baseNode);
    childNode.setPosition(0, 0, 200);
    grandChildNode.setParent(childNode);
    grandChildNode.setPosition(0, 50, 0);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
}



float position = 0.0f;
float direction = 1.0f;
//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    baseNode.pan(1);
    childNode.tilt(3);
    
    ofVec3f p = grandChildNode.getGlobalPosition();

    cout << position <<  endl;
    
    ofColor startColor  = ofColor::blue;
    ofColor endColor = ofColor::green;
    ofColor c = startColor.getLerped(endColor, position);
    
    position += (.01 * direction);
    
    if(position >= 1.0) {
        direction *= -1;
        position = 1.0;
    } else if(position <= 0.0) {
        direction *= -1;
        position = 0.0;
    }
    
    ofVec3f pc = ofVec3f(p.x, p.y);
    lineMesh.addColor(c);
    lineMesh.addVertex(p);
    
    if(lineMesh.getVertices().size() >  200) {
        lineMesh.getVertices().erase(lineMesh.getVertices().begin());
    }
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    cam.lookAt(childNode);
    
    cam.begin();
    lineMesh.draw();
    cam.end();
    
    
    
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

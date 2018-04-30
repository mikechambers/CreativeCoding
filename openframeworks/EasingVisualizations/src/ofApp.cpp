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
#include "ColorPalette.h"
#include "ColorPaletteManager.h"
#include "PointTween.h"



string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

float const TOP_Y_PADDING = 125;
float const BOTTOM_Y_PADDING = 125;
int const DURATION = 900;


float topY;
float bottomY;

bool paused = true;

MeshUtils utils;
ofxSyphonServer syphon;
ofRectangle bounds;
ofVec3f center;

ColorPalette cp;
ColorPalette cpWhite;
PointTween tween;
ofVec3f destination;
ofVec3f startPosition;

ofVboMesh mesh;



bool _tweenIsComplete = false;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    center = bounds.getCenter();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::fromHex(0xFDFDFD));

    startPosition.set(0,0);
    destination.set(bounds.width, 0);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_TRIANGLES);
    
    topY = center.y - TOP_Y_PADDING;
    bottomY = center.y + BOTTOM_Y_PADDING;
    
    vector<ofColor> c;
    c.push_back(ofColor(ofColor::white, 255));
    cpWhite.setColors(c);
    
    init();
}

int counter = 0;
void ofApp::init() {

    ColorPaletteManager cpm;
    cp = cpm.getRandomColorPalette();
    
    cp = (++counter % 2)?cp:cpWhite;
    
    tween.setTween(startPosition, destination, DURATION,
                   ofxeasing::Function::Exponential,
                   ofxeasing::Type::In);
    
    ofAddListener(tween.onTweenComplete, this, &ofApp::onTweenComplete);
    tween.start();
    
    _tweenIsComplete = false;
}

void ofApp::onTweenComplete(bool & complete) {
    _tweenIsComplete = true;
    
    updateMesh();
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused || _tweenIsComplete) {
        return;
    }
    
    tween.update();
    updateMesh();
}

void ofApp::updateMesh() {
    ofVec3f current = tween.getCurrentPosition();
    ofVec3f last = tween.getLastPosition();
    
    ofColor color = cp.getNextColor();
    
    ofVec3f topRight = ofVec3f(current.x, topY);
    
    mesh.addColor(color);
    mesh.addVertex(ofVec3f(last.x, topY)); // top left
    
    mesh.addColor(color);
    mesh.addVertex(topRight); //top right
    
    ofVec3f bottomLeft = ofVec3f(last.x, bottomY); //bottom left
    mesh.addColor(color);
    mesh.addVertex(bottomLeft); //bottom left
    
    mesh.addColor(color);
    mesh.addVertex(topRight); //top right
    
    mesh.addColor(color);
    mesh.addVertex(ofVec3f(current.x, bottomY)); //bottom right
    
    mesh.addColor(color);
    mesh.addVertex(bottomLeft); //bottom left
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
   
    mesh.draw();
    
    /*
    ofPushMatrix();
    ofTranslate(0, center.y);
    
    ofFill();
    ofSetColor(ofColor::black);
    ofDrawCircle(tween.getCurrentPosition(), 2);
    
    ofSetColor(ofColor::red);
    ofDrawCircle(tween.getLastPosition(), 2);
    
    ofPopMatrix();
     */
    
    ofSetColor(ofColor::black);
    ofDrawLine(0, topY, bounds.width, topY);
    ofDrawLine(0, bottomY, bounds.width, bottomY);
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    }  else if(key == 'n') {
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

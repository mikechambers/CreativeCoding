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
#include "ofxEasing.h"
#include "Canvas.h"

string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool const CLAMP_COLOR_VALUES = false ;

bool paused = false;

MeshUtils utils;
ofxSyphonServer syphon;
ofRectangle bounds;
ofVec3f center;

ofRectangle canvasBounds;

ofColor c1;
ofColor c2;

ofVboMesh mesh;

int xPos = 0;

Canvas canvas;

ofImage image;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 'p');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    center = bounds.getCenter();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);

    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINES);
    
    canvasBounds.width = 640;
    canvasBounds.height = 640;
    
    image.allocate(canvasBounds.width, canvasBounds.height, OF_IMAGE_COLOR_ALPHA);
    
    canvas.allocate(canvasBounds, ofColor::white);
    
    init();
}

void ofApp::init() {
    
    //c1 = ofColor::white;
    //c2 = ofColor::black;
    
    //0x00C9FF, 0x92FE9D
    //0xef32d9, 0x89fffd
    //0x9CECFB, 0x0052D4
    
    c1 = ofColor::fromHex(0xef32d9);//0x9CECFB
    c2 = ofColor::fromHex(0x89fffd);//0x0052D4
    
    //cout << "c1 : " << mColorToString(c1) << endl;
    //cout << "c2 : " << mColorToString(c2) << endl;
    
    drawGradient();
}

void ofApp::drawGradient() {
    
    ofPixels pixels;
    pixels.allocate(canvasBounds.width, canvasBounds.height, 4);
    
    ofxeasing::function easing = ofxeasing::circ::easeInOut;
    
    int len = canvasBounds.width;
    for(int i = 0; i < len; i++) {
        
        //t current position
        //b start position
        //c change between values
        //d length / duration
        
        float t = i;
        float d = len;
        
        float r;
        float g;
        float b;
        float a;
        
        //r
        float b2 = c1.r;
        float c = c2.r - c1.r;
        r = easing(t, b2, c, d);
        
        //g
        b2 = c1.g;
        c = c2.g - c1.g;
        g = easing(t, b2, c, d);
        
        //b
        b2 = c1.b;
        c = c2.b - c1.b;
        b = easing(t, b2, c, d);
        
        //a
        b2 = c1.a;
        c = c2.a - c1.a;
        a = easing(t, b2, c, d);
        
        ofColor stepColor = ofColor(r, g, b, a);
        
        if(CLAMP_COLOR_VALUES) {
            stepColor.r = ofClamp(r, 0, 255);
            stepColor.g = ofClamp(g, 0, 255);
            stepColor.b = ofClamp(b, 0, 255);
            stepColor.a = ofClamp(a, 0, 255);
        }
        
        for(int k = 0; k < canvasBounds.height; k++) {
            pixels.setColor(i, k, stepColor);
        }
        
        mesh.addColor(stepColor);
        mesh.addVertex(ofVec3f(xPos, 0));
        
        mesh.addColor(stepColor);
        mesh.addVertex(ofVec3f(xPos, canvasBounds.height));
    
    }
        
    image.setFromPixels(pixels);
    
    canvas.begin();
    image.draw(0,0);
    canvas.end();
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }

    canvas.draw(bounds);
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if(key == 's') {
        canvas.saveImage(APP_NAME);
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

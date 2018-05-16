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

string SAVE_PATH = ofFilePath::getUserHomeDir() + "/screenshots/";
string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

float const SCALE = 2;

bool paused = false;

ofxSyphonServer syphon;

ofRectangle windowBounds;
ofRectangle canvasBounds;

ofVec3f center;

Canvas canvas;

float radiusSeed = 10000;

//--------------------------------------------------------------
void ofApp::setup(){
    syphon.setName(APP_NAME);

    windowBounds = ofGetWindowRect();
    canvasBounds = ofRectangle(0,0, windowBounds.width * SCALE, windowBounds.height * SCALE);
    center = canvasBounds.getCenter();
    
    ofColor backgroundColor = ofColor::fromHex(0x424242);

    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);

    canvas.allocate(canvasBounds, backgroundColor);

    init();
}

void ofApp::init() {
    canvas.reset();
    
    ofPath path;
    path.setStrokeWidth(2);
    path.setStrokeColor(ofColor::white);
    path.setFilled(true);
    
    drawCircle2(path);
    
    canvas.begin();
    
    path.draw();
    
    canvas.end();
}

ofPath & ofApp::drawCircle2(ofPath & path) {
    
    float bRadius = 250;
    float frequency = 2;
    float seed = 0;
    float magnitude = 0.5;
    
//    /https://www.benfrederickson.com/flowers-from-simplex-noise/
    float samples = floor(2 * bRadius);
    for (int j = 0; j < samples + 1; ++j) {
        float angle = (2 * M_PI * j) / samples;
        
        // Figure out the x/y coordinates for the given angle
        float x = cos(angle);
        float y = sin(angle);
        
        // Randomly deform the radius of the circle at this point
        float deformation = ofNoise(x * frequency + radiusSeed,
                                          y * frequency + radiusSeed,
                                          seed) + 1;
        float radius = bRadius * (1 + magnitude * deformation);
        
        
        x  = canvasBounds.getCenter().x + radius * x;
        y = canvasBounds.getCenter().y + radius * y;
        
        if(j == 0) {
            path.moveTo(x, y);
        } else {
            path.curveTo(x, y);
        }
        
        
    }
    
    radiusSeed += .01;
    
    path.close();

    return path;

}

ofPath & ofApp::drawCircle1(ofPath & path) {
    int steps = 1440;
    float stepSize = (M_PI * 2) / steps;
    float baseRadius = 250;
    float radius = 0;
    int loops = 1;
    int scale =  50;
    
    float x;
    float y;
    for(float i = 0; i < (M_PI * 2) * loops; i += stepSize) {
        
        //radius = baseRadius + ((ofNoise(radiusSeed) * scale) - scale / 2) * (abs(sin(i / 2)));
        
        float s = ofMap(sin(i/2), 0, 1, 0, .2);
        //radius = baseRadius + ((ofNoise(abs(sin(i)) * radiusSeed) * scale) - scale / 2);
        radius = baseRadius + ((ofNoise(s * radiusSeed) * scale) - scale / 2);
        
        //cout << s << endl;
        
        x = center.x + (radius * cos(i));
        y = center.y + (radius * sin(i));
        
        if(i == 0) {
            path.moveTo(x, y);
        } else {
            path.curveTo(x, y);
        }
        
        radiusSeed += .001;
    }
    
    path.close();
    
    return path;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    init();
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    canvas.draw(windowBounds);
    
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

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
#include "Canvas.h"

string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

ofxSyphonServer syphon;
ofRectangle windowBounds;
ofRectangle canvasBounds;
ofVec3f center;

//canvas class that extends ofFbo. This makes it easy to draw
//and output at a higher resolution, but display in a smaller
//resolution window.
Canvas canvas;
float xstart;
float ynoise;
float xstartS;
float ynoiseS;
//--------------------------------------------------------------
void ofApp::setup(){
    syphon.setName(APP_NAME);

    //get window size
    windowBounds = ofGetWindowRect();
    
    //Set up the bounds that we will draw to. In this case, we will double
    //the size of the window
    canvasBounds = ofRectangle(0,0, windowBounds.width * 2, windowBounds.height * 2);
    
    center = canvasBounds.getCenter();
    
    //set background color (gray)
    ofColor backgroundColor = ofColor::fromHex(0x424242);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);
    
    //initialize our canvas
    canvas.allocate(canvasBounds, backgroundColor);
    float xstartS = ofRandom(10);
    float ynoiseS = ofRandom(10);
    init();
}

ofVec3f lastPoint;
void ofApp::init() {

    xstartS += 0.02;
    ynoiseS += 0.02;
    
    xstart = xstartS;
    ynoise = ynoiseS;
    
    //initialize seeds with random numbers.

    
    //reset / initialize canvas. Only necessary if we may
    //be doing multiple renderings (if you hit "n" it will
    //do another render)
    canvas.reset();
    
    //start capturing draw / render
    canvas.begin();
    
    //translate so we are working from the center of the screen
    ofTranslate(center.x, center.y, 0);
    
    lastPoint = ofVec3f(0,0,0);
    
    int scale = 8;
    int increment = 3;
    
    //now loop through and draw
    //The 8 constant in the loops determines the radius bounds of the drawing. with
    //higher numbers meaing smaller bounds
    //the 3 constant determines how closely the circles are drawn together as well
    //as total itegrations
    for(float y = -(canvasBounds.height / scale); y <=(canvasBounds.width / scale); y += increment) {
        ynoise += 0.02;
        float xnoise = xstart;
        
        for(float x = -(canvasBounds.width / scale); x <=(canvasBounds.width / scale); x+=increment){
            xnoise += 0.02;
            drawPoint(x, y, ofNoise(xnoise, ynoise));
        }
    }
    
    canvas.end();
}

void ofApp::drawPoint(float x, float y, float noiseFactor) {
    
    ofVec3f p = ofVec3f(x * noiseFactor * 4, y * noiseFactor * 4, -y);
    //store current transform, so we can return to it after we draw
    ofPushMatrix();
    
    //translate the drawing center (0,0,0) based on the noise passed in
    ofTranslate(p.x, p.y, p.z);
    
    //edgeSize determines the radius of the circle we draw.
    float edgeSize = noiseFactor * 16;
    
    //for openFrameworks, we cant specify different stroke and fill settings as
    //we can in processing (at least not when drawing procedurally), so we have
    //to do two drawing passes
    ofNoFill();
    ofSetColor(ofColor(ofColor::black), 128);
    ofDrawCircle(0,0, edgeSize);
    
    ofFill();
    ofSetColor(ofColor(ofColor::white), 200);
    ofDrawCircle(0,0, edgeSize);
    
    //ofSetColor(ofColor(ofColor::white), 128);
    //ofDrawLine(ofVec3f(0,0,0), lastPoint);
    lastPoint = p;
    
    
    //return to previous transform state
    ofPopMatrix();
    
    
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
    } else if (key == 'n') {
        //will do a new render
        init();
    } else if (key == 's') {
        //saves a screenshot (path is hardcoded in canvas)
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

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


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "GradientMathWork";

ofRectangle bounds;
ofRectangle drawingBounds;

bool paused = false;

class Line {
public:
    ofVec3f p1;
    ofVec3f p2;
};

Line axisLine;
Line leftLine;
Line rightLine;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 'p');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    drawingBounds = mGetBoundsWithPadding(bounds, 200);
    drawingBounds.setHeight(drawingBounds.height / 2);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    ofVec3f drawingCenter = drawingBounds.getCenter();
    
    //draw main axis  line
    axisLine.p1 = ofVec3f(ofGetMouseX(), ofGetMouseY());
    
    float m = (drawingCenter.y - axisLine.p1.y)/(drawingCenter.x - axisLine.p1.x);
    
    //atan(m) - angle in radians pi to 1/2pi is fine
    float r = sqrt(1 + (m * m));
    float dist = axisLine.p1.distance(drawingCenter) * 2;
    axisLine.p2 = mGetPointOnLine(axisLine.p1, drawingCenter, dist);
    
    //axisLine.p2.x = axisLine.p1.x + ((dist))/r;
    //axisLine.p2.y = axisLine.p1.y + ((dist) * m)/r;
    
    //find slope  of line
    // m = Change  in  y2 - y1/x2-1
    
    //float m = (axisLine.p2.y - axisLine.p1.y)/(axisLine.p2.x - axisLine.p1.x);
    cout << m << endl;
    //find equation of line parallele on left
    //https://math.stackexchange.com/questions/656500/given-a-point-slope-and-a-distance-along-that-slope-easily-find-a-second-p
    ofVec3f leftLineCenter = drawingBounds.getBottomLeft();
    
    //y - y1 = m(x - x1)
    //y = m(x - x1) + y1
    
    
    //float leftY = (m * x) - (m * leftLineCenter.x) + leftLineCenter.y;
    
    //leftLineCenter.y - y = m(leftLineCenter.x - x)
    //y = leftLineCenter.y - ((m * leftLineCenter.x) + (m * -x))
    
    //https://math.stackexchange.com/a/656511/161129
    //make this into util function
    //mGetPointOnLineWithSlope(point, slope, distance)
    //float r = sqrt(1 + (m * m));
    
    float leftX = leftLineCenter.x - (dist/2)/r;
    float leftY = leftLineCenter.y - ((dist/2) * m)/r;
    
    ofVec3f leftTop = ofVec3f(leftX, leftY);
  
    ofVec3f leftBottom;
    //leftBottom = mGetPointOnLine(leftTop, leftLineCenter, dist);
    
    //might want to look at replacing our own getpoint on line with this
    //as it might be faster
    leftBottom.x = leftTop.x + (dist)/r;
    leftBottom.y = leftTop.y + (dist * m)/r;
    
    leftLine.p1 = leftTop;
    leftLine.p2 = leftBottom;
    
    cout << mGetAngleOfLine(axisLine.p1, axisLine.p2) << endl;
    cout << mGetAngleOfLine(leftLine.p1, leftLine.p2) << endl;
    cout << mGetAngleOfLine(rightLine.p1, rightLine.p2) << endl;
    cout << "--------" << endl;
    
    /*********** DRAW RIGHT LINE ************/

    ofVec3f rightLineCenter = drawingBounds.getTopRight();
    float rightX = rightLineCenter.x - (dist/2)/r;
    float rightY = rightLineCenter.y - ((dist/2) * m)/r;
    
    ofVec3f rightTop = ofVec3f(rightX, rightY);
    
    ofVec3f rightBottom;
    //leftBottom = mGetPointOnLine(leftTop, leftLineCenter, dist);
    
    //might want to look at replacing our own getpoint on line with this
    //as it might be faster
    rightBottom.x = rightTop.x + (dist)/r;
    rightBottom.y = rightTop.y + (dist * m)/r;
    
    rightLine.p1 = rightTop;
    rightLine.p2 = rightBottom;

    //todo:
    //determine corner points based on center line position
    //point  direction based on quadrant?
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofNoFill();
    ofSetColor(ofColor::black);
    ofSetLineWidth(0.5);
    ofDrawRectangle(drawingBounds);
    
    ofFill();
    ofDrawCircle(drawingBounds.getCenter(), 2);
    
    //axis line
    ofDrawLine(axisLine.p1, axisLine.p2);
    ofDrawCircle(axisLine.p1, 2);
    
    //left bounds line
    ofDrawLine(leftLine.p1, leftLine.p2);
    ofDrawCircle(leftLine.p1, 2);
    
    //right bounds line
    ofSetColor(ofColor::black);
    ofDrawLine(rightLine.p1, rightLine.p2);
    ofDrawCircle(rightLine.p1, 2);
    
    ofSetColor(ofColor::red);
    ofDrawCircle(rightLine.p2, 2);
    ofDrawCircle(leftLine.p2, 2);
    ofDrawCircle(axisLine.p2, 2);
    
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

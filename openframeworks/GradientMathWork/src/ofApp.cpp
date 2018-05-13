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

ofVec3f center;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 'p');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    center = bounds.getCenter();
    
    drawingBounds = mGetBoundsWithPadding(bounds, 200);
    drawingBounds.setHeight(drawingBounds.height / 2);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
}

ofVec3f ofApp::transformPoint(ofVec3f p, ofVec3f origin, float theta) {
    ofVec3f out;
    
    out.x = origin.x+(p.x-origin.x)*cos(theta)+(p.y-origin.y)*sin(theta);
    out.y = origin.y-(p.x-origin.x)*sin(theta)+(p.y-origin.y)*cos(theta);
    
    return out;
}

ofVec3f topLeftBoundsPoint;
ofVec3f topRightBoundsPoint;
ofVec3f bottomRightBoundsPoint;
ofVec3f bottomLeftBoundsPoint;

float angle;

void ofApp::update() {
    
    ofVec3f center = drawingBounds.getCenter();
    
    ofVec3f mPoint = ofVec3f(ofGetMouseX(), ofGetMouseY());
    angle = -mGetAngleOfLine(center, mPoint);
    
    ofVec3f topLeftTransformPoint = transformPoint(
                                                   drawingBounds.getTopLeft(),
                                                   center,
                                                   angle);
    
    ofVec3f topRightTransformPoint = transformPoint(
                                                   drawingBounds.getTopRight(),
                                                   center,
                                                   angle);
    
    ofVec3f bottomRightTransformPoint = transformPoint(
                                                    drawingBounds.getBottomRight(),
                                                    center,
                                                    angle);
    
    ofVec3f bottomLeftTransformPoint = transformPoint(
                                                     drawingBounds.getBottomLeft(),
                                                     center,
                                                     angle);
    
    //https://stackoverflow.com/questions/622140/calculate-bounding-box-coordinates-from-a-rotated-rectangle
    float min_x = MIN(topLeftTransformPoint.x,topRightTransformPoint.x);
        min_x = MIN(min_x, bottomRightTransformPoint.x);
        min_x = MIN(min_x, bottomLeftTransformPoint.x);
    
    float min_y = MIN(topLeftTransformPoint.y,topRightTransformPoint.y);
    min_y = MIN(min_y, bottomRightTransformPoint.y);
    min_y = MIN(min_y, bottomLeftTransformPoint.y);
    
    float max_x = MAX(topLeftTransformPoint.x,topRightTransformPoint.x);
    max_x = MAX(max_x, bottomRightTransformPoint.x);
    max_x = MAX(max_x, bottomLeftTransformPoint.x);
    
    float max_y = MAX(topLeftTransformPoint.y,topRightTransformPoint.y);
    max_y = MAX(max_y, bottomRightTransformPoint.y);
    max_y = MAX(max_y, bottomLeftTransformPoint.y);
    
    //(min_x,min_y), (min_x,max_y), (max_x,max_y), (max_x,min_y)
    topLeftBoundsPoint = ofVec3f(min_x,min_y);
    topRightBoundsPoint = ofVec3f(min_x,max_y);
    bottomRightBoundsPoint = ofVec3f(max_x,max_y);
    bottomLeftBoundsPoint = ofVec3f(max_x,min_y);
    
    
    
    axisLine.p1 = ofVec3f(center.x, center.y);
    axisLine.p2 = ofVec3f(ofGetMouseX(), ofGetMouseY());
}


//--------------------------------------------------------------
void ofApp::update2(){
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
    

    //find equation of line parallele on left
    //https://math.stackexchange.com/questions/656500/given-a-point-slope-and-a-distance-along-that-slope-easily-find-a-second-p
    ofVec3f leftLineCenter = drawingBounds.getBottomLeft();
    

    
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
    
    float angle = mGetAngleOfLine(axisLine.p1, axisLine.p2);
    
    cout << angle << ":" << m << endl;
    
    if(angle > 0 && angle < M_PI / 2) {
        cout << "sector 1" << endl;
    } else if (angle > M_PI / 2 && angle < M_PI) {
        cout << "sector 2" << endl;
    } else if (angle < -M_PI / 2 && angle > -M_PI) {
        cout << "sector 3" << endl;
    } else if (angle < 0 && angle > -M_PI / 2) {
        cout << "sector 4" << endl;
    }
    
    
    //cout << mGetAngleOfLine(leftLine.p1, leftLine.p2) << endl;
    //cout << mGetAngleOfLine(rightLine.p1, rightLine.p2) << endl;
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
    
    ofPushMatrix();
        ofTranslate(drawingBounds.getCenter().x, drawingBounds.getCenter().y);
        ofRotateZ((-angle*180) / M_PI);
    
        //https://stackoverflow.com/questions/12516550/openframeworks-rotate-an-image-from-its-center-through-opengl-calls
        ofPushMatrix();
            ofTranslate(-drawingBounds.getCenter().x, -drawingBounds.getCenter().y);
            ofDrawLine(topLeftBoundsPoint, topRightBoundsPoint);
            ofDrawLine(topRightBoundsPoint, bottomRightBoundsPoint);
            ofDrawLine(bottomRightBoundsPoint, bottomLeftBoundsPoint);
            ofDrawLine(bottomLeftBoundsPoint, topLeftBoundsPoint);
        ofPopMatrix();
    ofPopMatrix();
    
    /*
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
    */
    /*
    ofNoFill();
    ofSetCircleResolution(50);
    ofSetColor(ofColor::black);
    float radius = drawingBounds.getTopLeft().distance(drawingBounds.getCenter());
    ofDrawCircle(drawingBounds.getCenter(), radius);
     */
    /*
    ofDrawLine(drawingBounds.getBottomLeft(), drawingBounds.getTopRight());
    
    float angle = mGetAngleOfLine(drawingBounds.getBottomLeft(), drawingBounds.getTopRight());
    
    angle += -M_PI / 2;
    
    ofVec3f p = mGetPointOnCircle(drawingBounds.getCenter(), 100, angle);
    
    ofSetColor(ofColor::red);
    ofDrawLine(drawingBounds.getCenter(), p);
    */
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

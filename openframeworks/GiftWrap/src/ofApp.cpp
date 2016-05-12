#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "GiftWrap";
const int ALPHA = 1.0 * 255;

bool paused = false;

vector<ofVec3f> points;

ofRectangle bounds;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName(APP_NAME);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    init();
}

void ofApp::init() {
    
    bounds = meshGetBoundsWithPadding(ofGetWindowRect(), 100);
    points = meshGetRandomPointsInBounds(bounds, 100);
}

float ofApp::getPolarAngleBetweenPoints(ofVec3f p1, ofVec3f p2) {
    //If you want the angle bewteen the vectors OP1 and OP2 (O being the origin),
    //double n1 = sqrt(x1*x1+y1*y1), n2 = sqrt(x2*x2+y2*y2);
    //double angle = acos((x1*x2+y1*y2)/(n1*n2)) * 180 / PI;
    
    
    float n1 = sqrt(p1.x * p1.x + p1.y * p1.y);
    float n2 = sqrt(p2.x * p2.x + p2.y * p2.y);
    
    return acos(( p1.x * p2.x + p1.y * p2.y) / (n1 * n2)) * 180 / PI;
}

//It is 0 on the line, and +1 on one side, -1 on the other side.
//http://stackoverflow.com/a/3461533
int ofApp::getOrientationOfPointToLine(ofVec3f v1, ofVec3f v2, ofVec3f p) {
    float position = ((v2.x - v1.x) * (p.y - v1.y) - (v2.y - v1.y) * (p.x - v1.x));
    
    if (position < 0) return -1;
    if (position > 0) return 1;
    return 0;
    
    
    //sign((Bx - Ax) * (Y - Ay) - (By - Ay) * (X - Ax))
}

vector<ofVec3f>pointsOnHull;
ofPath path;

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    //check points length;
    ofVec3f leftMost = points[0];
    
    int size = points.size();
    
    for(int i = 1; i < size; i++){
        
        ofVec3f p = points[i];
        if(p.x < leftMost.x) {
            leftMost = p;
        }
    }
    
    ofVec3f endPoint;
    vector<ofVec3f>pointsOnHull;
    
    ofVec3f pointOnHull = leftMost;
    
    //int i = 0;
    do {
        pointsOnHull.push_back(pointOnHull);
        endPoint = points[0];
        
    
        
        for(int j = 1; j < size; j++){
            
            if((endPoint == pointOnHull) ||
               getOrientationOfPointToLine(pointOnHull, endPoint, points[j]) == 1
            ){
            
                endPoint = points[j];
            }
        }
        //i++;
        pointOnHull = endPoint;
        
    } while(!(endPoint == pointsOnHull[0]));
    
  
    //vector<ofVec3f>pointsOnHull;
    int pSize = pointsOnHull.size();
    
    path.moveTo(pointsOnHull[0]);
    for(int i = 1; i < pSize; i++) {
        path.lineTo(pointsOnHull[i]);
    }
    
    path.close();
    path.setStrokeColor(ofColor(ofColor::black, ALPHA));
    path.setFillColor(ofColor(ofColor::black, ALPHA));
    path.setFilled(false);
    path.setStrokeWidth(1.0);
  
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    ofSetColor(ofColor::black);
    ofFill();
    
    vector<ofVec3f>::iterator it = points.begin();
    
    for(; it != points.end(); ++it){
        ofDrawCircle((*it), 2.0);
    }
    
    path.draw();
    
    
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

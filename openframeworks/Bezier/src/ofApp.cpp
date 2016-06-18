#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "QuadraticCurve.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Bezier";
const float RADIUS = 2.0;

bool paused = false;

vector<QuadraticCurve> segments;


#define NULL_VEC_X -9999999

ofPath path;
ofMesh mesh;
ofMesh lineMesh;

ofPolyline circle;



//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME);
    syphon.setName(APP_NAME);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    init();
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_TRIANGLES);
    
    lineMesh.enableColors();
    lineMesh.setMode(OF_PRIMITIVE_LINES);
    
    circle.arc(0, 0, RADIUS, RADIUS, 0, 360);
}

void ofApp::init() {
    
}

ofVec3f _lastCp = ofVec3f(NULL_VEC_X, 0, 0);

void ofApp::addControlPoint(ofVec3f cp) {
    if(_lastCp.x == NULL_VEC_X) {
        _lastCp = cp;
        return;
    }
    
    QuadraticCurve currentCurve;
    
    currentCurve.cp = _lastCp;
    
    if(segments.size() > 0) {
        QuadraticCurve _tmp = segments[segments.size() - 1];
        currentCurve.p1 = _tmp.p2;
    } else {
        currentCurve.p1 = _lastCp.interpolate(cp, 0.5);
    }
    
    currentCurve.p2 = _lastCp.interpolate(cp, 0.5);
    
    segments.push_back(currentCurve);
    
    addCircle(cp);
    
    ofSetLineWidth(0.5);
    
    lineMesh.addColor(ofColor::black);
    lineMesh.addVertex(currentCurve.p1);
    
    lineMesh.addColor(ofColor::black);
    lineMesh.addVertex(currentCurve.cp);
    
    lineMesh.addColor(ofColor::black);
    lineMesh.addVertex(currentCurve.p2);
    
    lineMesh.addColor(ofColor::black);
    lineMesh.addVertex(currentCurve.cp);
    
    
    _lastCp = cp;
}

void ofApp::addCircle(ofVec3f p) {
    
    int len = circle.getVertices().size();
    
    for(int i=0; i < len - 1; i++){
        mesh.addColor(ofColor::black);
        mesh.addVertex(circle[i] + p);
        
        mesh.addColor(ofColor::black);
        mesh.addVertex(circle[i+1] + p);
        
        mesh.addColor(ofColor::black);
        mesh.addVertex(ofVec3f(0,0) + p);
    }
}


//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    path.clear();
    //mesh.clear();
    
    
    int len = segments.size();
    
    for(int i = 0; i < len; i++) {
        QuadraticCurve c = segments[i];
        
        
        if(i == 0) {
            path.moveTo(c.p1);
        } else {
            path.quadBezierTo(c.p1, c.cp, c.p2);
        }
        
        //path.quadBezierTo(c.p1, c.cp, c.p2);
        
    }
    
    //path.close();
    path.setStrokeColor(ofColor::black);
    //path.setFillColor(ofColor::black);
    //path.setFilled(true);
    path.setStrokeWidth(2.0);
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    path.draw();
    mesh.draw();
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
    //ofVec3f p = ofVec3f(x, y, 0.0);
    //addControlPoint(p);
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){
    
    ofVec3f p = ofVec3f(x, y, 0.0);
    addControlPoint(p);

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

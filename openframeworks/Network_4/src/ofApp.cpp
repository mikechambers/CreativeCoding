#include "ofApp.h"
#include "MeshUtils.h"
#include "ImageLoader.h"
#include "ofxSyphonClient.h"

MeshUtils utils;

float const BOUNDS_PADDING = 100.0;
float const POINT_COUNT = 100000;
int const ALPHA = 1.0 * 255;
int const DISTANCE_THRESHOLD = 1;

ofRectangle bounds;
vector<ofVec3f>points;

ofVboMesh mesh;
ImageLoader image;

ofVec3f center;

ofxSyphonServer syphon;

ofEasyCam cam;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_4");
    syphon.setName("Network_4");
    
    cam.setDistance(600.0);
    
    center.set(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
    
    bounds = MeshUtils::getBoundsWithPadding(ofGetWindowRect(), BOUNDS_PADDING);
    points = MeshUtils::getRandomPointsInSphere(center, 100.0, POINT_COUNT);
    //points = MeshUtils::getRandomPointsInBounds(bounds, 100.0, POINT_COUNT);
    
    bool imageLoaded = image.load("../../../images/gradient_4.jpg");
    //bool imageLoaded = image.load("/Users/mesh/tmp/f2nbsPJ.jpg");
    

    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.setAlpha(ALPHA);
    image.resize(ofGetWidth() - BOUNDS_PADDING * 2, ofGetHeight() - BOUNDS_PADDING * 2);
    
    mesh.setMode(OF_PRIMITIVE_LINES);
    mesh.enableColors();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    if(mesh.getNumVertices() > 0) {
        return;
    }
    
    mesh.clear();
    
    for(int i = 0 ; i < POINT_COUNT; i++) {
        ofVec3f p = points[i]; //is this copying or passing by reference?
        
        ofVec3f dir = p - center;
        dir.normalize();
        
        ofVec3f p2 = p + (dir * ofRandom(10.0, DISTANCE_THRESHOLD));
        
        
        mesh.addColor(image.getColor(p));
        mesh.addVertex(p);
        
        mesh.addColor(ofColor(ofColor::white, 0.0));
        //mesh.addColor(image.getColor(p));
        mesh.addVertex(p2);
        
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    cam.begin();
    
    ofPushMatrix();
    //ofTranslate(-ofGetWidth()/2,-ofGetHeight()/2);
    ofRotate(ofGetFrameNum() * .75, .75, 0, .75);
    
    ofPushMatrix();
    ofTranslate(-ofGetWidth()/2,-ofGetHeight()/2);
    mesh.draw();

    /*
    ofSetColor(ofColor(image.getColor(center), 0.8 * 255));
    float radius = ofMap(sin(ofGetFrameNum() * 0.03), -1, 1, 2, 3);
    ofDrawSphere(center, radius);
    */
    ofPopMatrix();
    
    ofPopMatrix();
    
    cam.end();
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

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

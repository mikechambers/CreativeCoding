#include "ofApp.h"
#include "MeshUtils.h"
#include "ImageLoader.h"
#include "ofxSyphonClient.h"

MeshUtils utils;

float const BOUNDS_PADDING = 520.0;
float const POINT_COUNT = 100;
int const ALPHA = 0.5 * 255;
int const DISTANCE_THRESHOLD = 100;

ofRectangle bounds;
vector<ofVec3f>points;

ofVboMesh mesh;
ImageLoader image;

ofxSyphonServer syphon;

ofEasyCam cam;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_2");
    syphon.setName("Network_2");
    
    cam.setDistance(600.0);
    
    bounds = MeshUtils::getBoundsWithPadding(ofGetWindowRect(), BOUNDS_PADDING);
    points = MeshUtils::getRandomPointsInBounds(bounds, POINT_COUNT, 400.0);

    bool imageLoaded = image.load("../../../images/mike.png");
    //bool imageLoaded = image.load("/Users/mesh/tmp/f2nbsPJ.jpg");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    mesh.setMode(OF_PRIMITIVE_LINES);
    mesh.enableColors();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::black);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    mesh.clear();
    
    for(int i = 0 ; i < POINT_COUNT; i++) {
        ofVec3f p = points[i]; //is this copying or passing by reference?
        
        for(int k = 0; k < POINT_COUNT; k++) {
            if(k == i) {
                continue;
            }
            
            ofVec3f p2 = points[k];
           
            if(p.distance(p2) < DISTANCE_THRESHOLD) {
                mesh.addColor(ofColor(ofColor::white, ALPHA));
                //mesh.addColor(ofColor(image.getColor(p), ALPHA));
                mesh.addVertex(p);
                
                mesh.addColor(ofColor(ofColor::white, ALPHA));
                //mesh.addColor(ofColor(image.getColor(p2), ALPHA));
                mesh.addVertex(p2);
            }
        }
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    cam.begin();
    
    ofPushMatrix();
    //ofTranslate(-ofGetWidth()/2,-ofGetHeight()/2);
    ofRotate(ofGetFrameNum() * .75, .75, .75, 0);
    
    ofPushMatrix();
    ofTranslate(-ofGetWidth()/2,-ofGetHeight()/2);
    mesh.draw();

    
    
    ofSetColor(ofColor(ofColor::black, ALPHA));
    ofFill();
    for(int i = 0; i < POINT_COUNT; i++) {
        ofSetColor(ofColor(image.getColor(points[i]), ALPHA));
        //ofDrawCircle(points[i], 2.0);
        ofDrawSphere(points[i], 2.0);
    }
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

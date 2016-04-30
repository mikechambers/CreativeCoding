#include "ofApp.h"
#include "MeshUtils.h"
#include "ImageLoader.h"
#include "ofxSyphonClient.h"

MeshUtils utils;

float const BOUNDS_PADDING = 0.0;
float const POINT_COUNT = 1000;
int const ALPHA = 1.0 * 255;
int const RADIUS = 100;

ofRectangle bounds;
vector<ofVec3f>points;
vector<ofVec3f>outsidePoints;

ofVboMesh mesh;
ofVboMesh outsideMesh;

ImageLoader image;

ofVec3f center;

ofxSyphonServer syphon;

ofEasyCam cam;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_5");
    syphon.setName("Network_5");
    
    cam.setDistance(600.0);
    
    center.set(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
    
    points = MeshUtils::getRandomPointsOnSphere(center, RADIUS, POINT_COUNT);
    outsidePoints = MeshUtils::getRandomPointsOnSphere(center, RADIUS * 2, POINT_COUNT);
    
    bool imageLoaded = image.load("../../../images/building.jpg");
    

    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.setAlpha(ALPHA);
    image.resize(ofGetWidth() - BOUNDS_PADDING * 2, ofGetHeight() - BOUNDS_PADDING * 2);
    
    mesh.setMode(OF_PRIMITIVE_LINES);
    mesh.enableColors();
    
    outsideMesh.setMode(OF_PRIMITIVE_LINES);
    outsideMesh.enableColors();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
}

void ofApp::createSphere(vector<ofVec3f> & _points, ofVboMesh & _mesh) {
    
    for(int i = 0 ; i < POINT_COUNT; i++) {
        ofVec3f p = _points[i]; //is this copying or passing by reference?
        
        //value so we can figure out if the vector has been initialized
        int initValue = -10000000;
        ofVec3f closest(initValue, initValue, initValue);
        
        for(int k = 0; k < POINT_COUNT; k++) {
            
            if(i == k) {
                continue;
            }
            
            ofVec3f p2 = _points[k];
            
            if(closest.x == initValue) {
                closest = p2;
                continue;
            }
            
            if(p.distance(p2) < p.distance(closest)) {
                closest = p2;
            }
        }
        
        _mesh.addColor(image.getColor(p));
        _mesh.addVertex(p);
        
        _mesh.addColor(image.getColor(closest));
        _mesh.addVertex(closest);
    }
}


//--------------------------------------------------------------
void ofApp::update(){
    
    if(mesh.getNumVertices() > 0) {
        return;
    }
    
    mesh.clear();
    outsideMesh.clear();
    
    createSphere(points, mesh);
    createSphere(outsidePoints, outsideMesh);

    
    cout << "created" << endl;
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    cam.begin();
    
    ofPushMatrix();
        ofRotate(ofGetFrameNum() * .75, .75, 0, .75);
    
        ofPushMatrix();
            ofTranslate(-ofGetWidth()/2,-ofGetHeight()/2);
            mesh.draw();
    
        ofPopMatrix();

    ofPopMatrix();
    
    
    ofPushMatrix();
        ofRotate(ofGetFrameNum() * -.75, .75, 0, .75);
    
        ofPushMatrix();
            ofTranslate(-ofGetWidth()/2,-ofGetHeight()/2);
            outsideMesh.draw();
    
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

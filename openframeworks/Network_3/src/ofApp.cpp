#include "ofApp.h"
#include "MeshUtils.h"
#include "ImageLoader.h"
#include "ofxSyphonClient.h"

MeshUtils utils;

float const BOUNDS_PADDING = 500.0;
float const POINT_COUNT = 500;
int const ALPHA = 0.9 * 255;

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
    points = MeshUtils::getRandomPointsInBounds(bounds, POINT_COUNT);

    bool imageLoaded = image.load("../../../images/tycho_awake.png");
    //bool imageLoaded = image.load("/Users/mesh/tmp/f2nbsPJ.jpg");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    bounds = MeshUtils::getBoundsWithPadding(ofGetWindowRect(), BOUNDS_PADDING);
    points = MeshUtils::getRandomPointsInBounds(bounds, POINT_COUNT);
    
    mesh.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);
    mesh.enableColors();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    mesh.clear();
    
    for(int i = 0 ; i < POINT_COUNT; i++) {
        ofVec3f p = points[i]; //is this copying or passing by reference?
    
        vector<ofVec3f> _closest;
        
        for(int k = 0; k < POINT_COUNT; k++) {
            if(k == i) {
                continue;
            }
            
            ofVec3f p2 = points[k];
            
            if(_closest.size() == 0) {
                _closest.push_back(p2);
                continue;
            } else if (_closest.size() == 1) {
                if(p.distance(p2) < p.distance(_closest[0])) {
                    _closest.insert(_closest.begin(), p2);
                } else {
                    _closest.push_back(p2);
                }
                
                continue;
            }
            
            int s = _closest.size();
            for(int m = 0; m < s; m++) {
                if(p.distance(p2) < p.distance(_closest[m])) {
                    _closest.insert(_closest.begin() + m, p2);
                    break;
                }
            }
            
            if(_closest.size() > 2) {
                _closest.pop_back();
            }
        }
        
        mesh.addColor(ofColor(image.getColor(p), ALPHA));
        mesh.addVertex(p);
        
        mesh.addColor(ofColor(image.getColor(_closest[0]), ALPHA));
        mesh.addVertex(_closest[0]);
        
        mesh.addColor(ofColor(image.getColor(_closest[1]), ALPHA));
        mesh.addVertex(_closest[1]);
        
        _closest.clear();
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
    //mesh.draw();

    
    
    ofSetColor(ofColor(ofColor::black, ALPHA));
    ofFill();
    for(int i = 0; i < POINT_COUNT; i++) {
        ofSetColor(ofColor(image.getColor(points[i]), ALPHA));
        ofDrawCircle(points[i], 2.0);
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

#include "ofApp.h"
#include "MeshUtils.h"
#include "ImageLoader.h"

MeshUtils utils;

float const BOUNDS_PADDING = 50.0;
float const POINT_COUNT = 500;
int const ALPHA = 0.5 * 255;

ofRectangle bounds;
vector<ofVec3f>points;

ofVboMesh mesh;
ImageLoader image;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_2");
    
    bool imageLoaded = image.load("../../../images/hawaii.jpg");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    bounds = MeshUtils::getBoundsWithPadding(ofGetWindowRect(), BOUNDS_PADDING);
    points = MeshUtils::getRandomPointsInBounds(bounds, POINT_COUNT);
    
    mesh.setMode(OF_PRIMITIVE_TRIANGLES);
    mesh.enableColors();
    
    ofSetBackgroundColor(ofColor::white);
}

//--------------------------------------------------------------
void ofApp::update(){

    mesh.clear();
    
    for(int i = 0 ; i < POINT_COUNT; i++) {
        ofVec3f p = points[i];//is this copying or passing by reference?
        
        vector<ofVec3f> closePoints;
    
        for(int k = 0; k < POINT_COUNT; k++) {
            
            ofVec3f p2 = points[k];
            
            if(k == i) {
                continue;
            }
            
            for(int j = 0; j < 2; j++) {
                
                if(closePoints.size() < 1) {
                    closePoints.push_back(p2);
                    continue;
                }
                
                if(p.distance(p2) < p.distance(closePoints[0])) {
                    
                    if(closePoints.size() < 2) {
                        closePoints.push_back(closePoints[0]);
                    }
                    closePoints[0] = p2;
                }
            }
            
        }
        
        mesh.addColor(ofColor(image.getColor(p), ALPHA));
        mesh.addVertex(p);
        
        mesh.addColor(ofColor(image.getColor(closePoints[0]), ALPHA));
        mesh.addVertex(closePoints[0]);
        
        mesh.addColor(ofColor(image.getColor(closePoints[1]), ALPHA));
        mesh.addVertex(closePoints[1]);
    }
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    mesh.draw();
    
    /*
    ofSetColor(ofColor::white);
    ofFill();
    ofDrawRectangle(bounds);
    
    */
    ofSetColor(ofColor(ofColor::white, ALPHA));
    ofFill();
    for(int i = 0; i < POINT_COUNT; i++) {
        ofDrawCircle(points[i], 1.0);
    }
     
    
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

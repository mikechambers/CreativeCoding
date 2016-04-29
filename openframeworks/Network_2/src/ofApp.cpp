#include "ofApp.h"
#include "MeshUtils.h"
<<<<<<< HEAD

MeshUtils utils;

float const BOUNDS_PADDING = 100.0;
float const POINT_COUNT = 100000;

=======
#include "ImageLoader.h"

MeshUtils utils;

float const BOUNDS_PADDING = 50.0;
float const POINT_COUNT = 500;
int const ALPHA = 0.5 * 255;
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788

ofRectangle bounds;
vector<ofVec3f>points;

<<<<<<< HEAD
=======
ofVboMesh mesh;
ImageLoader image;
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenShot("Network_2");
    
<<<<<<< HEAD
    ofSetBackgroundColor(ofColor::white);

    bounds = MeshUtils::getBoundsWithPadding(ofGetWindowRect(), BOUNDS_PADDING);
    points = MeshUtils::getRandomPointsInBounds(bounds, POINT_COUNT);
=======
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
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788
}

//--------------------------------------------------------------
void ofApp::update(){

<<<<<<< HEAD
=======
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
    
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788
}

//--------------------------------------------------------------
void ofApp::draw(){
    
<<<<<<< HEAD
    
=======
    mesh.draw();
    
    /*
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788
    ofSetColor(ofColor::white);
    ofFill();
    ofDrawRectangle(bounds);
    
<<<<<<< HEAD
    
    ofSetColor(ofColor::black);
=======
    */
    ofSetColor(ofColor(ofColor::white, ALPHA));
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788
    ofFill();
    for(int i = 0; i < POINT_COUNT; i++) {
        ofDrawCircle(points[i], 1.0);
    }
<<<<<<< HEAD
=======
     
>>>>>>> 89bbbf19abcd54cb8c7a31d1e6d67916a6d04788
    
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

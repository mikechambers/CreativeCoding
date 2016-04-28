#include "ofApp.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "ImageLoader.h"

MeshUtils utils;

int const POINT_COUNT = 20;
int const ALPHA = 0.8 * 255;

ofVboMesh mesh;
vector<Mover>points;
ImageLoader image;
ofEasyCam cam;

//--------------------------------------------------------------
void ofApp::setup(){
    
    bool imageLoaded = image.load("../../../images/crates.jpg");
    
    cam.setDistance(500.0);
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    utils.enableScreenShot("Network");
    ofSetBackgroundColor(ofColor::white);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_TRIANGLE_FAN);
    
    for(int i = 0; i < POINT_COUNT; i++) {
        Mover m;
        m.setToRandomLocation();
        m.setToRandomVelocity(5.0);
        m.setBounds(ofGetWindowRect());
        m.location.z = ofRandom(-320.0, 320.0);
        points.push_back(m);
    }
    
    ofSetBackgroundAuto(true);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    /*
    for(int k = 0; k < POINT_COUNT; k++) {
        points[k].update();
    }
     */
    
    mesh.clear();
    
    for(int i = 0; i < POINT_COUNT; i++) {
        
        Mover m = points[i];
        
        
        mesh.addColor(ofColor(image.getColor(m.location), ALPHA));
        mesh.addVertex(m.location);
        
        for(int k = 0; k < POINT_COUNT; k++) {
            if(k == i) {
                continue;
            }
            
            Mover m2 = points[k];
            mesh.addColor(ofColor(image.getColor(m2.location), ALPHA));
            mesh.addVertex(m2.location);
        }
        
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    cam.begin();
    mesh.draw();
    cam.end();
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

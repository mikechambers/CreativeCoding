#include "ofApp.h"
#include "Follower.h"
#include "MeshUtils.h"

int const ITERATIONS = 1000;
int const ALPHA = 0.1 * 255;

Mover mover;
Follower follower;
Follower follower2;
Follower follower3;
Follower follower4;

MeshUtils utils;

ofVboMesh mesh;
ofImage image;

//--------------------------------------------------------------
void ofApp::setup(){

    utils.enableScreenShot("Follow");
    
    bool imageLoaded = image.load("../../../images/hawaii.jpg");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    
    ofBackground(ofColor::white);
    
    ofSetBackgroundAuto(false);
    
    init();
}

void ofApp::init(){
    
    ofClear(0, 255);
    mesh.clear();
    
    mover.setBounds(ofGetWindowRect());
    mover.setToRandomLocation();
    mover.setToRandomVelocity(5.0);
    
    follower.setToRandomLocation();
    follower2.setToRandomLocation();
    follower3.setToRandomLocation();
    follower4.setToRandomLocation();
    
    follower.setTarget(&mover);
    follower2.setTarget(&follower);
    follower3.setTarget(&follower2);
    follower4.setTarget(&follower3);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    mesh.clear();
    
    
    for(int i = 0; i < ITERATIONS; i++) {
        mover.update();
        
        //probably should store this in mouse move
        follower.update();
        mesh.addVertex(follower.location);
        mesh.addColor(ofColor(image.getColor(follower.location.x, follower.location.y), ALPHA));
        
        
        follower2.update();
        mesh.addVertex(follower2.location);
        mesh.addColor(ofColor(image.getColor(follower2.location.x, follower2.location.y), ALPHA));
        
        follower3.update();
        mesh.addVertex(follower3.location);
        mesh.addColor(ofColor(image.getColor(follower3.location.x, follower3.location.y), ALPHA));
        
        follower4.update();
        mesh.addVertex(follower4.location);
        mesh.addColor(ofColor(image.getColor(follower4.location.x, follower4.location.y), ALPHA));
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    //ofDrawCircle(follower.location, 5.0);
    
    mesh.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == 'x') {
        utils.disableScreenShot();
    } else if (key == 'r') {
        init();
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

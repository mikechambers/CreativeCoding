#include "ofApp.h"
#include "Follower.h"
#include "MeshUtils.h"
#include "ImageLoader.h"

int const ITERATIONS = 1000;
int const ALPHA = 0.1 * 255;
int const HEIGHT = 640;
int const WIDTH = 640;

Mover mover;
Follower follower;
Follower follower2;
Follower follower3;
Follower follower4;

MeshUtils utils;

ofVboMesh mesh;

ImageLoader imageLoader;

//--------------------------------------------------------------
void ofApp::setup(){

    utils.enableScreenshot("follow2");
    
    bool imageLoaded = imageLoader.load("../../../images/shoes.jpg", "../../../images/masks/cc.gif");
    
    if(!imageLoaded) {
        cout << "Exiting app." << endl;
        ofExit();
    }
    
    imageLoader.resize(WIDTH,HEIGHT);
    imageLoader.setAlpha(ALPHA);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    
    ofSetBackgroundAuto(false);
    
    init();
}

void ofApp::init(){
    
    ofClear(0, 255);
    ofBackground(ofColor::white);
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
        
        follower.update();
        mesh.addVertex(follower.location);
        
        mesh.addColor(imageLoader.getColor(follower.location));
        
        follower2.update();
        mesh.addVertex(follower2.location);
        mesh.addColor(imageLoader.getColor(follower2.location));
        
        follower3.update();
        mesh.addVertex(follower3.location);
        mesh.addColor(imageLoader.getColor(follower3.location));
        
        follower4.update();
        mesh.addVertex(follower4.location);
        mesh.addColor(imageLoader.getColor(follower4.location));
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    mesh.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == 'x') {
        utils.disableScreenshot();
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

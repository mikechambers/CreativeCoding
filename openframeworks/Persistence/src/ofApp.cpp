#include "ofApp.h"
#include "Mover.h"

bool const HEIGHT = 640;
bool const WIDTH = 640;
bool const DEPTH = 640;

float const ALPHA = 0.1 * 255;
float const INTERPOLATION = 0.25;

ofVboMesh mesh;
Mover mover;
Mover mover2;
ofImage image;


//--------------------------------------------------------------
void ofApp::setup(){
    
    bool imageLoaded = image.load("../../../images/building_3.jpg");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    mesh.setMode(OF_PRIMITIVE_LINES);
    mesh.enableColors();
    
    mover.setBounds(ofGetWindowRect());
    mover.setToRandomLocation();
    mover.setToRandomVelocity(5.0);
    
    mover2.setBounds(ofGetWindowRect());
    mover2.setToRandomLocation();
    mover2.setToRandomVelocity(5.0);
    
    mesh.setMode(OF_PRIMITIVE_LINES);
    
    ofBackground(ofColor::white);;
    
    ofSetBackgroundAuto(false);
    ofEnableSmoothing();
}

//--------------------------------------------------------------
void ofApp::update(){
    
    mesh.clear();
    
    for(int i = 0; i < 1000; i++) {
    
        mover.update();
        mover2.update();
        
        mesh.addVertex(mover.location);
        mesh.addColor(ofColor(image.getColor(mover.location.x, mover.location.y), ALPHA));
        
        
        ofVec3f t = mover.location.getInterpolated(mover2.location, INTERPOLATION);
        mesh.addVertex(t);
        mesh.addColor(ofColor(image.getColor(t.x, t.y), ALPHA));
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    mesh.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == 's') {
        string n = "../../../screenshots/Persistence/screenshot_" + ofGetTimestampString() + ".png";
        ofSaveScreen(n);
        cout << "Screenshot Saved" << endl;
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
    mover.setToRandomVelocity(5.0);
    mover2.setToRandomVelocity(5.0);

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

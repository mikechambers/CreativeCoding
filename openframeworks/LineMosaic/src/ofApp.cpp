#include "ofApp.h"

float const INTERPOLATION = 0.3;
float const ALPHA = 0.5 * 255;

ofVboMesh mesh;
ofImage image;


//--------------------------------------------------------------
void ofApp::setup(){

    bool imageLoaded = image.load("../../../images/slime.png");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    image.resize(640,640);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINES);
    
    ofBackground(0,0,0);
    ofSetBackgroundAuto(false);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    mesh.clear();
    
    for(int i = 0; i < 25000; i++) {
        ofVec3f a(ofRandomWidth(), ofRandomHeight(), 0.0);
        ofVec3f b(ofRandomWidth(), ofRandomHeight(), 0.0);
        
        ofVec3f c = a.getInterpolated(b, INTERPOLATION);
        
        mesh.addVertex(a);
        mesh.addColor(ofColor(image.getColor(a.x, a.y), ALPHA));
        
        
        mesh.addVertex(c);
        mesh.addColor(ofColor(image.getColor(c.x, c.y), ALPHA));
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    mesh.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
    if(key == 's') {
        string n = "screenshot_" + ofGetTimestampString() + ".png";
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

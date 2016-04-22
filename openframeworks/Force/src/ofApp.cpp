#include "ofApp.h"


vector<Balloon> balloons;
ofVec3f wind;
ofVec3f bounce;
ofVec3f gravity;
int const RADIUS = 1;
int const ITERATIONS = 2;
int const ALPHA = 0.2 * 255;
float counter = .5;

MeshUtils utils;
ImageLoader loader;

Mover mover;

ofVboMesh mesh;

bool started = false;

//--------------------------------------------------------------
void ofApp::setup(){
    mover.setBounds(ofGetWindowRect());
    mover.setToRandomLocation();
    mover.setToRandomVelocity(5.0);
    
    utils.enableScreenShot("Force");
    bool imageLoaded = loader.load("../../../images/gradient_4.jpg", "../../../images/masks/cc.gif");
    
    if(!imageLoaded) {
        cout << "Exiting app." << endl;
        ofExit();
    }
    
    loader.resize(640, 640);
    loader.setAlpha(ALPHA);
    loader.useMask(true);
    
    wind = ofVec3f(0.0, 0.0, 0.0);
    bounce = ofVec3f(0.0, 0.05, 0.0);
    gravity = ofVec3f(0.0, 0.05, 0.0);
    ofBackground(ofColor::white);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    mesh.drawWireframe();
    
    ofSetBackgroundAuto(false);
}

Balloon ofApp::createBalloon(int x, int y) {
    Balloon b = Balloon();
    b.setBounds(ofGetWindowRect());
    b.location.set(x, y, 0.0);
    balloons.push_back(b);
}

//--------------------------------------------------------------
void ofApp::update(){
    
    if(!started) {
        return;
    }
    
    for(int i = 0; i < ITERATIONS; i++) {
        
        mover.update();
        createBalloon(mover.location.x, mover.location.y);
        
        int bSize = balloons.size();
        
        if(bSize == 0) {
            return;
        }
        
        mesh.clear();
        
        float n = ofMap(ofNoise(counter), 0.0, 1.0, -0.01, 0.01);
        
        wind.x += n;
        counter += 0.1;
        
        vector<Balloon>::iterator it = balloons.begin();
        
        for(; it != balloons.end(); ++it) {
            Balloon &b = *it;
            b.applyForce(gravity);
            b.applyForce(wind);
            
            b.update();
            
            mesh.addColor(loader.getColor(b.location));
            mesh.addVertex(b.location);
        }
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    if(!started) {
        return;
    }
    
    mesh.draw();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        started = !started;
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
    createBalloon(x, y);
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

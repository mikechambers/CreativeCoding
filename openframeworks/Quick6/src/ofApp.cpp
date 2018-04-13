#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "Mover.h"
#include "Node.h"
#include "ImageLoader.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Quick5";

const int GRAVITY_RANGE = 100;
const int POINT_COUNT = 25000 ;
const float MAX_RANGE = 8.0;
const float MIN_RANGE = 2.0;
const float STEP_SIZE = 0.02;
const float RADIUS_SIZE = 1;
const int MIN_OPACITY = 32;
const int MAX_OPACITY = 200;

const string IMG_PATH = "../../../images/mike.png";

ofRectangle bounds;

bool paused = false;

Mover mouseMover;
ofVec3f mousePosition;
vector<Node> followers;

ImageLoader image;

ofVboMesh mesh;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 'p');
    syphon.setName(APP_NAME);
    
    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    ofSetCircleResolution(50);
    
    mesh.setMode(OF_PRIMITIVE_LINE_LOOP);
    mesh.enableColors();
    
    image.load(IMG_PATH);
    image.resize(640, 640);
    
    init();
}

void ofApp::init() {
    mousePosition = mouseMover.location;
    
    mouseMover.mass = GRAVITY_RANGE;
    mouseMover.minGravityInfluence = 20;
    mouseMover.gravity_coefficient = 10;
    
    vector<ofVec3f> points = mGetRandomPointsInBounds(bounds, POINT_COUNT);
    //movers
    
    //f.location = points[0];
    //f2.location = points[1];
    
    //f.setTarget(&f2);
    //f2.setTarget(&f);
    
    for(int i = 0; i < POINT_COUNT; i++) {
        //Node target;
        ofVec3f p = points[i];

        Node t(p, MIN_RANGE, MAX_RANGE, STEP_SIZE);
        t.location = p;
        
        followers.push_back(t);
    }

    vector<Node>::iterator it = followers.begin();
    for(; it != followers.end(); ++it){
        
        Follower &n = *it;
        if(it == followers.begin()) {
            n.setTarget(&followers.back());
            continue;
        }
        
        n.setTarget(&followers.at((it - followers.begin()) - 1));
    }
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    mesh.clear();

    mouseMover.location = ofVec3f(mouseX, mouseY, 0.0);

    vector<Node>::iterator it = followers.begin();
    for(; it != followers.end(); ++it){
        
        int opacity = MIN_OPACITY;
        Node &n = *it;
        
        float d = ofDist(mouseMover.location.x, mouseMover.location.y, n.location.x, n.location.y);
        if(d < GRAVITY_RANGE) {
            ofVec3f force = mouseMover.repel(n);
            
            float mod = ((GRAVITY_RANGE - d) / GRAVITY_RANGE);
            n.applyForce(force * mod);
            
            opacity = mConstrain(200 * mod, MIN_OPACITY, MAX_OPACITY);
        }

        n.update();
        
        //mesh.addColor(ofColor(ofColor::black, 100));
        mesh.addColor(ofColor(image.getColor(n.location), opacity));
        //mesh.addColor(ofColor::black);
        mesh.addVertex(n.location);
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }

    mesh.draw();

    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
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

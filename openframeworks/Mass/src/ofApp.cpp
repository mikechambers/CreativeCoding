#include "ofApp.h"
#include "Mover.h"
#include "ForceInfluencer.h"
#include "ImageLoader.h"
#include "MeshUtils.h"

int const MOVER_COUNT = 50;
float const INFLUENCE_RADIUS = 100;
float const MAX_VELOCITY = 1.0;
float const MIN_MASS = 2.0;
float const MAX_MASS = 10.0;
float const REPEL = true;


float const FRICTION_COEFFICIENT = 0.0;
float const NORMAL = 1.0;
int const ALPHA = 0.1 * 255;

MeshUtils utils;

ofVec3f wind(0.0, 0.0, 0.0);
ofVec3f gravity(0.0, 0.0, 0.0);

ForceInfluencer influencer;

ImageLoader image;

ofVboMesh mesh;

bool paused = true;


vector<Mover> movers;


//--------------------------------------------------------------
void ofApp::setup(){
    
    ofSetFrameRate(60);
    syphon.setName("Mass");
    
    utils.enableScreenShot("Mass");
    image.load("../../../images/building_3.jpg");
    //image.load("/Users/mesh/tmp/color-gradient-wallpaper-3.jpg");
    
    image.resize(640, 640);
    
    influencer.location.set(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
    influencer.setBounds(ofGetWindowRect());
    influencer.influenceRadius = INFLUENCE_RADIUS;
    influencer.setToRandomVelocity(2.0);
    
    for(int i = 0; i < MOVER_COUNT; i++) {
        
        Mover mover;
        mover.setBounds(ofGetWindowRect());//maybe default this in the class?
        //mover.setToRandomLocation();
        mover.location.set(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
        mover.setToRandomVelocity(MAX_VELOCITY);
        mover.mass = ofRandom(MIN_MASS, MAX_MASS);
        
        movers.push_back(mover);
    }
    
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    mesh.enableColors();
    
    //ofSetBackgroundColorHex(0x222222);
    ofSetBackgroundColor(ofColor::white);
    ofSetBackgroundAuto(false);
    
}


//--------------------------------------------------------------
void ofApp::update(){
    
    if(paused) {
        return;
    }
    
    mesh.clear();
    
    influencer.update();
    
    vector<Mover>::iterator it = movers.begin();

    for(; it != movers.end(); ++it){
        Mover &m = *it;
        
        ofVec3f iF = influencer.influence(m);
        
        //check friction
        ofVec3f friction = m.velocity * -1;
        friction.normalize();
        friction *= FRICTION_COEFFICIENT;
        
        m.applyForce((gravity * m.mass) + wind + iF + friction);//this works as long as only y has a value
        
        friction.set(0.0,0.0,0.0);
        
        //friction
        
        //checkRepel(&m);
        
        m.update();
        
        
        mesh.addColor(ofColor(image.getColor(m.location), ALPHA));
        mesh.addVertex(m.location);
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
    
    
    /*
    ofSetColor(ofColor(ofColor::white, ALPHA));
    ofFill();
    
    vector<Mover>::iterator it = movers.begin();
    
    for(; it != movers.end(); ++it){
        Mover &m = *it;
    
        //see if we can figure out how to add this to Mover
        ofDrawCircle(m.location, 1);
    }
    
    
    ofDrawCircle(influencer.location, 2);
    */
    
    //ofNoFill();
    //ofSetColor(ofColor(ofColor::white, ALPHA));
    //ofDrawCircle(influencer.location, influencer.influenceRadius);
    
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
    Mover m;
    m.location.set(x, y, 0.0);
    m.velocity.set(0.0, 1.0, 0.0);
    m.mass = ofRandom(20.0);
    m.setBounds(ofGetWindowRect());
    
    movers.push_back(m);
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

#include "ofApp.h"
#include "Mover.h"
#include "ImageLoader.h"
#include "MeshUtils.h"

int const MOVER_COUNT = 50;
//float const INFLUENCE_RADIUS = 100;
float const MAX_VELOCITY = 2.0;
float const MIN_MASS = 2.0;
float const MAX_MASS = 10.0;

float const FRICTION_COEFFICIENT = 0.0;
float const NORMAL = 1.0;
int const ALPHA = 0.8 * 255;

MeshUtils utils;

ofVec3f wind(0.0, 0.0, 0.0);
ofVec3f gravity(0.0, 0.0, 0.0);

Mover influencer;

ImageLoader image;

bool paused = false;


vector<Mover> movers;


//--------------------------------------------------------------
void ofApp::setup(){
    
    ofSetFrameRate(60);
    syphon.setName("Mass");
    
    utils.enableScreenShot("Mass_2");
    image.load("../../../images/water_color.jpg");
    image.setAlpha(ALPHA);
    //image.load("/Users/mesh/tmp/color-gradient-wallpaper-3.jpg");
    
    image.resize(640, 640);
    
    influencer.location.set(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
    influencer.setBounds(ofGetWindowRect());
    //influencer.influenceRadius = INFLUENCE_RADIUS;
    //influencer.setToRandomVelocity(2.0);
    influencer.mass = 50.0;
    
    for(int i = 0; i < MOVER_COUNT; i++) {
        
        Mover mover;
        mover.setBounds(ofGetWindowRect());//maybe default this in the class?
        mover.setToRandomLocation();
        //mover.location.set(ofGetWidth() / 2, ofGetHeight() / 2, 0.0);
        mover.setToRandomVelocity(MAX_VELOCITY);
        mover.mass = ofRandom(MIN_MASS, MAX_MASS);
        
        movers.push_back(mover);
    }
    
    //mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    //mesh.enableColors();
    
    ofSetBackgroundColorHex(0x111111);
    //ofSetBackgroundColor(ofColor::black);
    ofSetBackgroundAuto(true);
    
}


//--------------------------------------------------------------
void ofApp::update(){
    
    if(paused) {
        return;
    }
    
    vector<Mover>::iterator it = movers.begin();

    for(; it != movers.end(); ++it){
        Mover &m = *it;
        
        ofVec3f iF = influencer.attract(m);
        
        //check friction
        ofVec3f friction = m.velocity * -1;
        friction.normalize();
        friction *= FRICTION_COEFFICIENT;
        
        m.applyForce((gravity * m.mass) + wind + iF + friction);//this works as long as only y has a value
        
        friction.set(0.0,0.0,0.0);

        m.update();
        m.checkBounds();
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    //mesh.draw();
    
    

    ofSetColor(ofColor(ofColor::white, ALPHA));
    ofFill();
    
    vector<Mover>::iterator it = movers.begin();
    
    for(; it != movers.end(); ++it){
        Mover &m = *it;
    
        ofSetColor(image.getColor(m.location));
        
        //see if we can figure out how to add this to Mover
        ofDrawCircle(m.location, m.mass);
        ofVec3f p = meshGetPointOnCircleAlongLing(m.location, m.mass, influencer.location);
        
        ofDrawLine(influencer.location, p);
    }
    
    syphon.publishScreen();
    
    //ofNoFill();
    //ofDrawCircle(influencer.location, influencer.mass);

    
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

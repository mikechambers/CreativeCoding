/*
    Copyright Mike Chambers 2018
    mikechambers@gmail.com

    http://www.mikechambers.com
    https://github.com/mikechambers/CreativeCoding

    Released un an MIT License
    https://github.com/mikechambers/CreativeCoding/blob/master/LICENSE.txt
*/

#include "ofApp.h"

#include "ofxSyphonClient.h"
#include "MeshUtils.h"
#include "EasingMetadata.h"

string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

int const INNER_RADIUS = 10;
int const OUTER_RADIUS = 50;

MeshUtils utils;
ofxSyphonServer syphon;
ofRectangle bounds;
ofVec3f center;

ofVboMesh mesh;
vector<EasingMetadata> easings;
float cIndex = 0;
int easingIndex = -1;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    center = bounds.getCenter();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::fromHex(0x222222));

    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINES);
    
    initEasingData();
    init();
}

void ofApp::init() {
    cIndex = 0;
    
    easingIndex++;
    
    if(easingIndex == easings.size()) {
        easingIndex = 0;
    }
    
    mesh.clear();
    
    //this is inefficient, but i am lazy
    EasingMetadata ed = easings.at(easingIndex);
    cout <<  "(" << easingIndex << " : " << easings.size() << ") " << ed.name << endl;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    if(cIndex >= 20 ) {
        return;
    }
    
    EasingMetadata ed = easings.at(easingIndex);
    ofxeasing::function easing = ofxeasing::easing(ed.family, ed.type);
    
    /*
     t = Current Time
     b = Start Value
     c = Change between start and end values
     d = Total time / steps
     */
    
    float t = cIndex;
    float b = 0;
    float d = 20;
    
    float c = M_PI * 2;
    float angle = easing(t, b, c, d);
    ofVec3f p1 = mGetPointOnCircle(center, INNER_RADIUS, angle);
    ofVec3f p2 = mGetPointOnCircle(center, OUTER_RADIUS, angle);

    //ofColor color = ofColor((ofColor::white, (cIndex / 20)) * 255);
    ofColor color = ofColor::white;
    mesh.addColor(color);
    mesh.addVertex(p1);
    
    mesh.addColor(color);
    mesh.addVertex(p2);
    
    //this is what get eased
    cIndex++;
    
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
    } else if (key == 'n') {
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

void ofApp::initEasingData() {
    
    EasingMetadata e;
    
    /**** Linear *******/
    e.name = "Linear";
    e.family = ofxeasing::Function::Linear;
    e.type = ofxeasing::Type::In;
    
    easings.push_back(e);
    
    /*
     e = EasingMetadata();
     e.name = "Linear::Out";
     e.family = ofxeasing::Function::Linear;
     e.type = ofxeasing::Type::Out;
     
     easings.push_back(e);
     
     e = EasingMetadata();
     e.name = "Linear::InOut";
     e.family = ofxeasing::Function::Linear;
     e.type = ofxeasing::Type::InOut;
     
     easings.push_back(e);
     */
    
    /**** Sine *******/
    e = EasingMetadata();
    e.name = "Sine::In";
    e.family = ofxeasing::Function::Sine;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Sine::Out";
    e.family = ofxeasing::Function::Sine;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Sine::InOut";
    e.family = ofxeasing::Function::Sine;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Circular *******/
    e = EasingMetadata();
    e.name = "Circular::In";
    e.family = ofxeasing::Function::Circular;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Circular::Out";
    e.family = ofxeasing::Function::Circular;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Circular::InOut";
    e.family = ofxeasing::Function::Circular;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Quadratic *******/
    e = EasingMetadata();
    e.name = "Quadratic::In";
    e.family = ofxeasing::Function::Quadratic;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Quadratic::Out";
    e.family = ofxeasing::Function::Quadratic;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Quadratic::InOut";
    e.family = ofxeasing::Function::Quadratic;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Cubic *******/
    e = EasingMetadata();
    e.name = "Cubic::In";
    e.family = ofxeasing::Function::Cubic;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Cubic::Out";
    e.family = ofxeasing::Function::Cubic;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Cubic::InOut";
    e.family = ofxeasing::Function::Cubic;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Quartic *******/
    e = EasingMetadata();
    e.name = "Quartic::In";
    e.family = ofxeasing::Function::Quartic;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Quartic::Out";
    e.family = ofxeasing::Function::Quartic;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Quartic::InOut";
    e.family = ofxeasing::Function::Quartic;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Quintic *******/
    e = EasingMetadata();
    e.name = "Quintic::In";
    e.family = ofxeasing::Function::Quintic;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Quintic::Out";
    e.family = ofxeasing::Function::Quintic;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Quintic::InOut";
    e.family = ofxeasing::Function::Quintic;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Exponential *******/
    e = EasingMetadata();
    e.name = "Exponential::In";
    e.family = ofxeasing::Function::Exponential;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Exponential::Out";
    e.family = ofxeasing::Function::Exponential;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Exponential::InOut";
    e.family = ofxeasing::Function::Exponential;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Back *******/
    e = EasingMetadata();
    e.name = "Back::In";
    e.family = ofxeasing::Function::Back;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Back::Out";
    e.family = ofxeasing::Function::Back;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Back::InOut";
    e.family = ofxeasing::Function::Back;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Bounce *******/
    e = EasingMetadata();
    e.name = "Bounce::In";
    e.family = ofxeasing::Function::Bounce;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Bounce::Out";
    e.family = ofxeasing::Function::Bounce;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Bounce::InOut";
    e.family = ofxeasing::Function::Bounce;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
    
    /**** Elastic *******/
    e = EasingMetadata();
    e.name = "Elastic::In";
    e.family = ofxeasing::Function::Elastic;
    e.type = ofxeasing::Type::In;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Elastic::Out";
    e.family = ofxeasing::Function::Elastic;
    e.type = ofxeasing::Type::Out;
    easings.push_back(e);
    
    e = EasingMetadata();
    e.name = "Elastic::InOut";
    e.family = ofxeasing::Function::Elastic;
    e.type = ofxeasing::Type::InOut;
    easings.push_back(e);
}


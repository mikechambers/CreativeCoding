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
#include "ofxEasing.h"
#include "Canvas.h"
#include "EasingMetadata.h"

string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool const CLAMP_COLOR_VALUES = true;

const string FONT_PATH = "/Users/mesh/SFCompactText-Light.otf";

bool paused = false;

MeshUtils utils;
ofxSyphonServer syphon;
ofRectangle bounds;
ofVec3f center;

ofRectangle canvasBounds;

ofColor c1;
ofColor c2;

ofVboMesh mesh;

int xPos = 0;

Canvas canvas;

ofImage image;

vector<EasingMetadata> easings;
int easingIndex = -1;

string easingName;

ofTrueTypeFont font;


//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 'p');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    center = bounds.getCenter();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);

    font.load(FONT_PATH, 16, true, true);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINES);
    
    canvasBounds.width = 640;
    canvasBounds.height = 640;
    
    image.allocate(canvasBounds.width, canvasBounds.height, OF_IMAGE_COLOR_ALPHA);
    
    canvas.allocate(canvasBounds, ofColor::white);
    
    initEasingData();
    
    init();
}

void ofApp::init() {
    
    //c1 = ofColor::white;
    //c2 = ofColor::black;
    
    //0x00C9FF, 0x92FE9D
    //0xef32d9, 0x89fffd
    //0x9CECFB, 0x0052D4
    //#ED4264, #FFEDBC
    
    c1 = ofColor::fromHex(0xED4264);//0x9CECFB
    c2 = ofColor::fromHex(0xFFEDBC);//0x0052D4

    easingIndex++;
    
    if(easingIndex == easings.size()) {
        easingIndex = 0;
    }
    
    drawGradient();
}

void ofApp::drawGradient() {
    
    ofPixels pixels;
    pixels.allocate(canvasBounds.width, canvasBounds.height, 4);

    //ofxeasing::function easing = ofxeasing::circ::easeInOut;
    
    EasingMetadata ed = easings.at(easingIndex);
    ofxeasing::function easing = ofxeasing::easing(ed.family, ed.type);
    
    easingName = ed.name;
    
    cout <<  "(" << easingIndex << " : " << easings.size() << ") " << easingName << endl;
    
    int len = canvasBounds.width;
    for(int i = 0; i < len; i++) {
        
        //t current position
        //b start position
        //c change between values
        //d length / duration
        
        float t = i;
        float d = len;
        
        float r;
        float g;
        float b;
        float a;
        
        //r
        float b2 = c1.r;
        float c = c2.r - c1.r;
        r = easing(t, b2, c, d);
        
        //g
        b2 = c1.g;
        c = c2.g - c1.g;
        g = easing(t, b2, c, d);
        
        //b
        b2 = c1.b;
        c = c2.b - c1.b;
        b = easing(t, b2, c, d);
        
        //a
        b2 = c1.a;
        c = c2.a - c1.a;
        a = easing(t, b2, c, d);
        
        ofColor stepColor = ofColor(r, g, b, a);
        
        if(CLAMP_COLOR_VALUES) {
            stepColor.r = ofClamp(r, 0, 255);
            stepColor.g = ofClamp(g, 0, 255);
            stepColor.b = ofClamp(b, 0, 255);
            stepColor.a = ofClamp(a, 0, 255);
        }
        
        for(int k = 0; k < canvasBounds.height; k++) {
            pixels.setColor(i, k, stepColor);
        }
        
        mesh.addColor(stepColor);
        mesh.addVertex(ofVec3f(xPos, 0));
        
        mesh.addColor(stepColor);
        mesh.addVertex(ofVec3f(xPos, canvasBounds.height));
    
    }
        
    image.setFromPixels(pixels);
    
    canvas.begin();
    image.draw(0,0);
    canvas.end();
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }

    canvas.draw(bounds);
    
    ofSetColor(ofColor(ofColor::black, 200));
    ofDrawRectangle(0, bounds.height - 26, bounds.width, 26);
    
    float w = font.stringWidth(easingName);
    float h = font.stringHeight(easingName);
    
    ofSetColor(ofColor::white);
    font.drawString(easingName, bounds.width - w - 10, (bounds.height - h / 2) + 2);
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if(key == 's') {
        canvas.saveImage(APP_NAME + "_" + easingName);
    } else if(key == 'n') {
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


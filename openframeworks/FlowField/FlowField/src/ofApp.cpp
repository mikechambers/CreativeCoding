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
#include "Canvas.h"
#include "EdgeMover.h"

string SAVE_PATH = ofFilePath::getUserHomeDir() + "/screenshots/";
string APP_NAME = ofFilePath::getFileName(ofFilePath::getCurrentExePath());

bool paused = false;

ofxSyphonServer syphon;

ofRectangle windowBounds;
ofRectangle canvasBounds;

ofVec3f center;

Canvas canvas;

EdgeMover mover;

int scale = 30;
int cols;
int rows;
float inc = .01;
float zOff = 0;

vector<ofVec3f> vectors;

//--------------------------------------------------------------
void ofApp::setup(){
    syphon.setName(APP_NAME);

    windowBounds = ofGetWindowRect();
    canvasBounds = ofRectangle(0,0, windowBounds.width * 2, windowBounds.height * 2);
    center = canvasBounds.getCenter();
    
    ofColor backgroundColor = ofColor::fromHex(0xFFFFFF);

    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(backgroundColor);

    canvas.allocate(canvasBounds, backgroundColor);

    mover.bounds = canvasBounds;
    mover.position = mGetRandomPointInBounds(canvasBounds);
    //mover.velocity = mGetRandomVelocity();
    
    float angle = 0.01;
    
    init();
}

void ofApp::init() {
    canvas.reset();
    
    cols = floor(canvasBounds.width / scale);
    rows = floor(canvasBounds.height / scale);
    
    vectors.clear();
    //vectors.reserve(cols * rows);
    
    canvas.begin();
    
    
    float yOff = 0;//ofRandom(10000);
    for(int y = 0; y < rows; y++) {
        
        float xOff = 0;
        for(int x = 0; x < cols; x++) {
            int index = (x + y * cols);
            
            float angle = ofNoise(xOff, yOff, zOff) * (M_PI * 2);
            
            ofVec3f v = mVectorFromAngle(angle);
            
            
            //cout << angle << " : " << mAngleFromVector(v) << endl;
            v.limit(4);

            //vectors[index] = v;
            vectors.push_back(v);
            
            
            ofPushMatrix();
            
            ofTranslate(x * scale, y * scale);
            ofRotate(mAngleFromVector(v) * (180 / M_PI));

            
            
            ofSetLineWidth(2);
            ofSetColor(ofColor::fromHex(0x00000055));
            ofDrawLine(0, 0, scale, 0);
            
            ofPopMatrix();
            
            xOff += inc;
        }
        
        yOff += inc;
    }
    
    canvas.end();
    
    cout << vectors.size() << endl;
    
    zOff += inc;
}

//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    //init();
    
    int y = floor(mover.position.y / scale);
    int x = floor(mover.position.x / scale);
    int index = (int)(y + x * cols);
    
    cout << vectors.size() << ":" << index << endl;
    ofVec3f force = vectors.at(index);
    
    if(force.y < -6) {
        cout << "hit" << endl;
    }
    
    cout << force.x << ":" << force.y << ":" << force.z << endl;
    
    mover.applyForce(force);
    
    mover.update();
    
    
    
    canvas.begin();
    
    ofFill();
    ofSetColor(ofColor::fromHsb(0, 0, 0));
    ofDrawCircle(mover.position, 4);
    
    canvas.end();
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    canvas.draw(windowBounds);
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if(key == 's') {
        canvas.saveImage(SAVE_PATH + APP_NAME);
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

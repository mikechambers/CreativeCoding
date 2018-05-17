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

#include "LinearGradient.h"

MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "Gradient";

ofRectangle bounds;

ofVboMesh mesh;

ofFbo fbo;

bool paused = false;

LinearGradient gradient;

ofRectangle gradientBounds;

//--------------------------------------------------------------
void ofApp::setup(){
    utils.enableScreenshot(APP_NAME, 's');
    syphon.setName(APP_NAME);

    bounds = ofGetWindowRect();
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::white);
    
    //mesh = mGradientTopLeftToBottomRight(bounds, ofColor::yellow, ofColor::orange, ofColor::red);
    //http://i.stack.imgur.com/aGiVE.png
    //mesh = mGradientLeftToRight(bounds, ofColor(0,255,50), ofColor(255,0,100));

    //mesh = mGradientCenter(bounds, ofColor::yellow, ofColor::orange);
    
    //mesh = mGradientFourCorners(bounds, ofColor::yellow, ofColor::pink, ofColor::orange, ofColor::yellow);
    
    
    fbo.allocate(bounds.width, bounds.height, GL_RGBA);

    gradientBounds = mGetBoundsWithPadding(bounds, 100);
    gradient.setBounds(gradientBounds);
    
    //LINEAR_SQUARED, COS_SQUARED, LINEAR_NOT_SQUARED, COS_NOT_SQUARED
    gradient.setMode(COS_SQUARED);
    gradient.addStep(ofColor::yellow,  0.0);
    //gradient.addStep(ofColor(ofColor::green, 128), 0.5);
    gradient.addStep(ofColor(ofColor::red, 255),  1.0);
    gradient.render();
    
    //fbo.begin();
    //gradient.draw();
    //fbo.end();
    
}

ofVboMesh ofApp::mGradientFourCorners(ofRectangle & bounds, ofColor c1, ofColor c2, ofColor c3, ofColor c4) {
    ofVboMesh _out;
    _out.enableColors();
    _out.setMode(OF_PRIMITIVE_TRIANGLES);
    
    _out.addColor(c1);
    _out.addVertex(bounds.getTopLeft());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getTopRight());
    
    _out.addColor(c4);
    _out.addVertex(bounds.getBottomLeft());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getTopRight());
    
    _out.addColor(c3);
    _out.addVertex(bounds.getBottomRight());
    
    _out.addColor(c4);
    _out.addVertex(bounds.getBottomLeft());
    
    return _out;
}

ofVboMesh ofApp::mGradientTopLeftToBottomRight(ofRectangle & bounds, ofColor c1, ofColor c2, ofColor c3) {
    ofVboMesh _out;
    _out.enableColors();
    _out.setMode(OF_PRIMITIVE_TRIANGLES);
    
    _out.addColor(c1);
    _out.addVertex(bounds.getTopLeft());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getTopRight());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getBottomLeft());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getTopRight());
    
    _out.addColor(c3);
    _out.addVertex(bounds.getBottomRight());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getBottomLeft());
    
    return _out;
}

ofVboMesh ofApp::mGradientCenter(ofRectangle & bounds, ofColor c1, ofColor c2) {
    ofVec3f center = bounds.getCenter();
    
    uint resolution = 20;
    ofVec3f xStep = ofVec3f(bounds.width / resolution, 0);
    ofVec3f yStep = ofVec3f(0, bounds.height / resolution);
    
    ofVboMesh _out;
    _out.enableColors();
    _out.setMode(OF_PRIMITIVE_TRIANGLE_FAN);
    
    _out.addColor(c2);
    _out.addVertex(center);
    
    for(int i = 0; i <  resolution; i++) {
        _out.addColor(c1);
        _out.addVertex(bounds.getTopLeft() + (xStep * i));
    }
    
    for(int i = 0; i <  resolution; i++) {
        _out.addColor(c1);
        _out.addVertex(bounds.getTopRight() + (yStep * i));
    }
    
    for(int i = 0; i <  resolution; i++) {
        _out.addColor(c1);
        _out.addVertex(bounds.getBottomRight() - (xStep * i));
    }
    
    for(int i = 0; i <  resolution; i++) {
        _out.addColor(c1);
        _out.addVertex(bounds.getBottomLeft() - (yStep * i));
    }
    
    _out.addColor(c1);
    _out.addVertex(bounds.getTopLeft());
    
    return _out;
}

ofVboMesh ofApp::mGradientLeftToRight(ofRectangle & bounds, ofColor c1, ofColor c2) {
    ofVboMesh _out;
    _out.enableColors();
    _out.setMode(OF_PRIMITIVE_TRIANGLES);
    
    _out.addColor(c1);
    _out.addVertex(bounds.getTopLeft());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getTopRight());
    
    _out.addColor(c1);
    _out.addVertex(bounds.getBottomLeft());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getTopRight());
    
    _out.addColor(c2);
    _out.addVertex(bounds.getBottomRight());
    
    _out.addColor(c1);
    _out.addVertex(bounds.getBottomLeft());
    
    return _out;
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
    

    //mesh.draw();
    //fbo.draw(0,0);
    
    gradient.draw();
    
    //ofSetColor(ofColor::black);
    //ofNoFill();
    //ofDrawRectangle(gradientBounds);
    
    //gradient.draw();
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if (key == 'p') {
        string n = "../../../screenshots/" + APP_NAME + "_" + ofGetTimestampString() + ".png";
        ofSaveScreen(n);
        cout << "Screenshot Saved : '" + n  + "'"<< endl;
        
        ofPixels pixels;
        fbo.readToPixels(pixels);
        ofSaveImage(pixels, n, OF_IMAGE_QUALITY_BEST);
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

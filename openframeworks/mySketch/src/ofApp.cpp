#include "ofApp.h"


#define POINT_COUNT 10000
#define RADIUS 8
#define PADDING 20

ofRectangle bounds;
vector<ofPoint> points;

ofPoint ofApp::getPointWithinBounds(ofRectangle bounds, int padding) {

	float x = ofRandom(bounds.x + padding - 1, bounds.width - padding + 1);
	float y = ofRandom(bounds.y + padding - 1, bounds.height - padding + 1);

	return ofPoint(x, y);
}

void ofApp::initPoints() {

	for(int i = 0; i < POINT_COUNT; i++) {
		points.push_back(getPointWithinBounds(bounds, PADDING));
	}
}

//--------------------------------------------------------------
void ofApp::setup(){
	ofSetFrameRate(60);

	ofBackgroundHex(0x111111); // set background to black
	ofSetBackgroundAuto(true); // set background to clear automatically every frame

	bounds = ofRectangle(0,0,ofGetWidth(), ofGetHeight());

	initPoints();
	ofEnableAlphaBlending();
}

//--------------------------------------------------------------
void ofApp::update(){
	ofEnableSmoothing();
}

//--------------------------------------------------------------
void ofApp::draw(){


	vector<ofPoint>::iterator it = points.begin();
 
	ofSetColor(244,244,244, 50);
	ofNoFill();

	ofPoint p;
	while( it != points.end() ){
		p = (*it);

		ofCircle(p.x, p.y, RADIUS);

		++it;
	}

	/*
	OF_BLENDMODE_DISABLED
	OF_BLENDMODE_ALPHA
	OF_BLENDMODE_ADD
	OF_BLENDMODE_SUBTRACT
	OF_BLENDMODE_MULTIPLY
	OF_BLENDMODE_SCREEN
	*/

	//ofEnableBlendMode(OF_BLENDMODE_SUBTRACT);
	/*
	ofSetHexColor(0x0000FF);
	ofCircle(245, 155, 60);
	ofSetHexColor(0xFF0000);
	ofCircle(200, 200, 60);
	ofSetHexColor(0x00FF00);
	ofCircle(275, 200, 60);
	*/
	//ofDisableBlendMode();

	//hasDrawn = true;
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

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
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

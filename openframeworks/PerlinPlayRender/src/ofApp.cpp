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
#include "ImageLoader.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "PerlinPlay";
const bool CLEAR_BETWEEN_FRAMES = false;
const bool DRAW_GRADIENT = false;
const bool RANDOMIZE_PARAMETERS = true;
const int REFRESH_SECONDS =  10;
const int OUTPUT_WIDTH = 3840;
const int OUTPUT_HEIGHT = 2160;


ofRectangle windowBounds;
ofRectangle renderBounds;

bool paused = false;

ofVboMesh mesh;
ImageLoader image;

ofFbo renderer;
ofPixels gradientColors;

/** Render Settings **/
bool CIRCLE = false;
int RADIUS = 600;
int OPACITY = 20;
int STEPS = 200;
float I_MOD = 0.008;
float T_MOD = 0.005;
bool GRADIENT_FOUR_COLOR = true;

ofColor c1;
ofColor c2;
ofColor c3;
ofColor c4;


void ofApp::setup(){
    syphon.setName(APP_NAME);
    
    windowBounds = ofGetWindowRect();
    //renderBounds = ofRectangle(0,0, 1920, 1080);
    //4k 3840 pixels × 2160
    renderBounds = ofRectangle(0,0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
    
    ofSetBackgroundAuto(CLEAR_BETWEEN_FRAMES);
    ofSetBackgroundColor(ofColor::black);
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    
    init();
}

void ofApp::init(){

    initParameters();
    
    ofFbo tmpRenderer;
    renderer = tmpRenderer;
    
    renderer.clear();
    renderer.allocate(renderBounds.width, renderBounds.height, GL_RGB);
    ofEnableAlphaBlending();
    
    renderer.begin();
    ofClear(ofColor::black);
    renderer.end();
    
    mesh.clear();

    
    ofVboMesh gradientMesh;
    gradientMesh.enableColors();
    gradientMesh.setMode(OF_PRIMITIVE_TRIANGLES);
    
    ofVec3f topLeft = renderBounds.getTopLeft();
    ofVec3f topRight = renderBounds.getTopRight();
    ofVec3f bottomRight = renderBounds.getBottomRight();
    ofVec3f bottomLeft = renderBounds.getBottomLeft();
    

    if(GRADIENT_FOUR_COLOR) {
        /* triangle 1 */
        gradientMesh.addVertex(topLeft);
        gradientMesh.addColor(c1);
        
        gradientMesh.addVertex(topRight);
        gradientMesh.addColor(c2);
        
        gradientMesh.addVertex(bottomLeft);
        gradientMesh.addColor(c4);
        
        /* triangle 2 */
        gradientMesh.addVertex(topRight);
        gradientMesh.addColor(c2);
        
        gradientMesh.addVertex(bottomRight);
        gradientMesh.addColor(c3);
        
        gradientMesh.addVertex(bottomLeft);
        gradientMesh.addColor(c4);
    } else {
        /* triangle 1 */
        gradientMesh.addVertex(topLeft);
        gradientMesh.addColor(c1);
        
        gradientMesh.addVertex(topRight);
        gradientMesh.addColor(c2);
        
        gradientMesh.addVertex(bottomLeft);
        gradientMesh.addColor(c1);
        
        /* triangle 2 */
        gradientMesh.addVertex(topRight);
        gradientMesh.addColor(c2);
        
        gradientMesh.addVertex(bottomRight);
        gradientMesh.addColor(c2);
        
        gradientMesh.addVertex(bottomLeft);
        gradientMesh.addColor(c1);
    }
    
    
    gradientColors.clear();
    gradientColors.allocate(renderBounds.width, renderBounds.height, OF_IMAGE_COLOR_ALPHA);
    
    ofFbo gradientFbo;
    gradientFbo.allocate(renderBounds.width, renderBounds.height, GL_RGB);
    ofEnableAlphaBlending();
    
    gradientFbo.begin();
    gradientMesh.draw();
    gradientFbo.end();
    
    gradientFbo.readToPixels(gradientColors);
}

void ofApp::initParameters() {

    c1 = ofColor::green;
    c2 = ofColor::yellow;
    c3 = ofColor::red;
    c4 = ofColor::blue;
    
    if(RANDOMIZE_PARAMETERS) {
        
        I_MOD = ofRandom(0.006, 0.009);
        T_MOD = ofRandom(0.004, 0.006);
        CIRCLE = (ofRandom(1) > 0.5)? true : false;
        GRADIENT_FOUR_COLOR = (ofRandom(1) > 0.5)? true : false;
        STEPS = ofRandom(25, 1000);
        RADIUS = ofRandom(50, 1800);
        OPACITY = ofRandom(10, 255);
        
        c1 = mRandomColor();
        c2 = mRandomColor();
        c3 = mRandomColor();
        c4 = mRandomColor();
    }

    cout << RADIUS << endl;
    
}

int lastScreenShotTime = 0;
float t = 0;
//--------------------------------------------------------------
void ofApp::update(){
    if(paused) {
        return;
    }
    
    int elapsedTime = int(ofGetElapsedTimef());
    
    if(lastScreenShotTime != elapsedTime && int(elapsedTime) % REFRESH_SECONDS == 0) {
        saveImageOfRender();
        lastScreenShotTime = elapsedTime;
        init();
        return;
    }
    
    
    ofVec3f center = renderBounds.getCenter();
    //int STEPS = 50;
    
    //bool CIRCLE = false;
    //int RADIUS = 600;
    //int OPACITY = 20;
    
    mesh.clear();

    float radius = RADIUS;
    float centerY = center.y;

    
    //http://genekogan.com/code/p5js-perlin-noise/
    for(int i = 0; i < STEPS; i++) {
        
        ofVec3f p;
        //0.008
        float distortion = RADIUS * ofNoise(i * I_MOD, t * T_MOD); //, t

        if(CIRCLE) {
            float ang = ofMap(i, 0, STEPS -  1,  0, M_TWO_PI );
            //float radius = 200 * ofNoise(i * 0.2, t * 0.0005);

            radius = distortion * ofNoise(ofGetSystemTimeMicros() * 0.001);
            p = mGetPointOnCircle(center, radius, ang);
        } else {
            float ang = ofMap(i, 0, STEPS - 1,  0, renderBounds.width);
            //float distortion = 100 * ofNoise(ang * 0.003, t * 0.005);

            p = ofVec3f(ang, (centerY + distortion - (RADIUS / 2)));
        }

        mesh.addVertex(p);
        mesh.addColor(ofColor(gradientColors.getColor(p.x, p.y),  OPACITY));
    }
    
    t++;
    
    renderer.begin();
    mesh.draw();
    renderer.end();
}

void ofApp::saveImageOfRender() {
    ofPixels pixels;
    renderer.readToPixels(pixels);
    string n = "../../../screenshots/" + APP_NAME + "_" + ofGetTimestampString() + ".png";
    
    cout << "Saving FBO Render : " << n << endl;
    ofSaveImage(pixels, n);
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }
    
    //mesh.draw();

    float tW = windowBounds.height;
    float tH = (tW * renderBounds.height) / renderBounds.width;
    
    float offset = windowBounds.getCenter().y - (tH / 2);

    renderer.draw(0, offset, tW, tH);
    
    if(DRAW_GRADIENT){
        ofImage image;
        image.setFromPixels(gradientColors);
        image.resize(windowBounds.width, windowBounds.height);
        image.draw(0,0);
    }
    
    
    syphon.publishScreen();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == ' ') {
        paused = !paused;
    } else if(key == 's') {
        saveImageOfRender();
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

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
#include "Canvas.h"
#include "ColorPaletteManager.h"
#include "ColorPalette.h"


MeshUtils utils;
ofxSyphonServer syphon;

const string APP_NAME = "PerlinPlay";
const bool DRAW_GRADIENT = false;
const bool RANDOMIZE_PARAMETERS = true;
const int REFRESH_SECONDS =  10;
const int OUTPUT_WIDTH = 3840;
const int OUTPUT_HEIGHT = 2160;
const int TRANSPARENT_BACKGROUND = true;

const bool ONE_OFF_OVERRIDE = true;


ofRectangle windowBounds;
ofRectangle renderBounds;

bool paused = false;

ofVboMesh mesh;
ImageLoader image;

Canvas canvas;
ofPixels gradientColors;

/** Render Settings **/
bool CIRCLE = false;
int RADIUS = 600;
int OPACITY = 10;
int STEPS = 200;
float I_MOD = 0.008;
float T_MOD = 0.005;
bool GRADIENT_FOUR_COLOR = false;

ofColor c1;
ofColor c2;
ofColor c3;
ofColor c4;

ColorPaletteManager colorManager;

void ofApp::setup(){
    syphon.setName(APP_NAME);
    
    windowBounds = ofGetWindowRect();
    //renderBounds = ofRectangle(0,0, 1920, 1080);
    //4k 3840 pixels × 2160
    renderBounds = ofRectangle(0,0, OUTPUT_WIDTH, OUTPUT_HEIGHT);
    
    ofSetBackgroundAuto(true);
    ofSetBackgroundColor(ofColor::fromHex(0x333333));
    
    mesh.enableColors();
    mesh.setMode(OF_PRIMITIVE_LINE_STRIP);
    
    ofEnableAlphaBlending();
    
    int glMode = GL_RGB;
    int backgroundOpacity = 255;
    if(TRANSPARENT_BACKGROUND) {
        backgroundOpacity = 0;
        glMode = GL_RGBA;
    }
    
    canvas.allocate(renderBounds, ofColor(ofColor::black, backgroundOpacity), glMode);
    
    init();
}

void ofApp::init(){

    initParameters();
    
    canvas.reset();
    
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

    ColorPalette cp = colorManager.getRandomColorPalette();
    
    c1 = ofColor::green;
    c2 = ofColor::yellow;
    c3 = ofColor::red;
    c4 = ofColor::blue;
    
    

    
    if(RANDOMIZE_PARAMETERS) {
        
        I_MOD = ofRandom(0.006, 0.009);
        T_MOD = ofRandom(0.004, 0.006);
        //CIRCLE = (ofRandom(1) > 0.5)? true : false;
        GRADIENT_FOUR_COLOR = (ofRandom(1) > 0.5)? true : false;
        STEPS = ofRandom(25, 1000);
        RADIUS = ofRandom(200, 2200); //2200 is height that wont go out of bounds for 4k
        OPACITY = ofRandom(50, 255);
        
        c1 = cp.getColorAtIndex(0);
        //skip one color to  jump ahead
        c2 = cp.getColorAtIndex(2);
        c3 = cp.getColorAtIndex(3);
        c4 = cp.getColorAtIndex(4);
        

    }

    if(ONE_OFF_OVERRIDE) {
        GRADIENT_FOUR_COLOR = false;
        c1 = ofColor(27, 12, 51);
        c2 = ofColor(212, 163, 254);
        c3 = ofColor(27, 12, 51);
        c4 = ofColor(212, 163, 254);
        
        //212, 163, 254 (light), 27, 12, 51
        
        OPACITY = 200;
        RADIUS = ofRandom(1800, 2200);
    }
    
    cout << "I_MOD : " << I_MOD << endl;
    cout << "T_MOD : " << T_MOD << endl;
    cout << "STEPS : " << STEPS << endl;
    cout << "Radius : " << RADIUS << endl;
    cout << "---------------" << endl;
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
        
        if(!DRAW_GRADIENT) {
            saveImageOfRender();
        }
        
        lastScreenShotTime = elapsedTime;
        init();
        return;
    }
    
    
    ofVec3f center = renderBounds.getCenter();
    
    mesh.clear();

    float radius = RADIUS;
    float centerY = center.y;

    
    //http://genekogan.com/code/p5js-perlin-noise/
    for(int i = 0; i < STEPS; i++) {
        
        ofVec3f p;
        //0.008
        float distortion = RADIUS * ofNoise(i * I_MOD, t * T_MOD); //, t

        if(CIRCLE) {
            float ang = ofMap(i, 0, STEPS,  0, M_TWO_PI );
            //float radius = 200 * ofNoise(i * 0.2, t * 0.0005);

            radius = distortion * ofNoise(ofGetSystemTimeMicros() * 0.001);
            p = mGetPointOnCircle(center, radius, ang);
        } else {
            float ang = ofMap(i, 0, STEPS,  0, renderBounds.width);
            
            //make  sure we dont go outside of the bounds
            ang = ofClamp(ang, 0, renderBounds.width);
            
            //need this to make sure graphic goes all the way to the edge
            //align last pixel with bounds on right
            if(i == STEPS - 1) {
                ang = renderBounds.width;
            }
            
            p = ofVec3f(ang, (centerY + distortion - (RADIUS / 2)));
        }

        
        //need this to make sure color doesnt overflow
        //to start
        float colorXPosition = p.x;
        if(i == STEPS - 1) {
            colorXPosition = renderBounds.width - 1;
        }

        
        mesh.addColor(ofColor(gradientColors.getColor(colorXPosition, p.y),  OPACITY));
        mesh.addVertex(p);
    }
    
    t++;
    
    canvas.begin();
    mesh.draw();
    canvas.end();
}

void ofApp::saveImageOfRender() {
    canvas.saveImage(APP_NAME);
}

//--------------------------------------------------------------
void ofApp::draw(){
    if(paused) {
        syphon.publishScreen();
        return;
    }

    
    if(DRAW_GRADIENT){
        ofImage image;
        image.setFromPixels(gradientColors);
        image.resize(windowBounds.width, windowBounds.height);
        image.draw(0,0);
    }  else {
        canvas.draw(windowBounds);
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

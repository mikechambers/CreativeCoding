#include "ofApp.h"


ofBlendMode BLEND_MODE = OF_BLENDMODE_DISABLED;
int const MIN_WIDTH = 10;
int const MAX_WIDTH = 100;
int const HEIGHT = 2; // this also becomes width if RANDOM_WIDTH is false
bool const RANDOM_WIDTH = TRUE;
bool const INFLUENCE_WIDTH = FALSE; //whether the width is adjust pased on position
bool const DRAW_RECT_ROUNDED = FALSE;
bool const DRAW_IMAGE = FALSE;
bool const ANIMATE = true;
bool const CALCULATE_Z = false;

bool hasRendered = false;

ofImage image;
ofVboMesh mesh;

ofEasyCam cam;


//--------------------------------------------------------------
void ofApp::setup(){

    bool imageLoaded = image.load("../../../images/hawaii.jpg");
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    //ofSetWindowShape(image.getWidth(), image.getHeight());
    
    image.resize(640, 640);
    
    mesh.setMode(OF_PRIMITIVE_TRIANGLE_STRIP);
    mesh.enableColors();
    mesh.enableIndices();
}

//--------------------------------------------------------------
void ofApp::update(){

    if(hasRendered) {
        return;
    }
    
    //mesh.clear();
    
    //fbo.begin();
    //ofClear(255,255,255, 0);
    
    //need to put this is a regular vbo
    /*
    if(DRAW_IMAGE){
        image.draw(0,0);
    }
     */
    
    
    //ofEnableBlendMode(BLEND_MODE);
    
    
    int rWidth = HEIGHT;
    int rHeight = HEIGHT;
    
    //todo: might need to get from window in case we scale image
    //should this be a float?
    int w = image.getWidth();
    int h = image.getHeight();
    
    for(int i = 0; i < h;) {
        for(int k = 0; k < w;) {
            
            if(RANDOM_WIDTH) {
                
                int rW = MAX_WIDTH;
                if(INFLUENCE_WIDTH) {
                    //this generates width. if random number is 0, then max width with be 2 x min width
                    rW = (MAX_WIDTH *  ((float(k) / float(w)))) + (MIN_WIDTH * 2); // subtract ratio from 1 to reverse side
                }
                
                rWidth = int(ofRandom(
                                      MIN_WIDTH,
                                      rW
                                      ));
            }
            
            //make sure the width / rect doesnt go out of bounds
            if(rWidth + k > w) {
                int tmp = (rWidth + k) - w;
                rWidth -= tmp;
            }
            
            ofRectangle rect = ofRectangle::ofRectangle(k, i, rWidth, rHeight);
            ofColor color = getColorForSubsection(rect);
            
            
            float z = 0.0;
            
            if(CALCULATE_Z) {
                float saturation = color.getSaturation();
                z = ofMap(saturation, 0, 255, -100, 100);
            }
            
            //ofDrawRectangle(k, i, rWidth, rHeight);
            
            ofVec3f tLeft(k, i, z); //0
            ofVec3f bLeft(k, i + rHeight, z); //1
            ofVec3f tRight(k + rWidth, i, z); //2
            ofVec3f bRight(k + rWidth, i + rHeight, z); //3
            
            int index = mesh.getNumVertices();
            
            mesh.addVertex(tLeft);
            mesh.addColor(color);
            
            mesh.addVertex(bLeft);
            mesh.addColor(color);
            
            mesh.addVertex(tRight);
            mesh.addColor(color);
            
            mesh.addVertex(bRight);
            mesh.addColor(color);
            
            index = k * i;
            mesh.addIndex(index);
            mesh.addIndex(index + 1);
            mesh.addIndex(index + 2);
            
            mesh.addIndex(index + 1);
            mesh.addIndex(index + 2);
            mesh.addIndex(index + 3);
            
            k += rWidth;
            
        }
        i += rHeight;
        
    }
    
    hasRendered = !ANIMATE;
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    
    
    cam.begin();
    
    ofPushMatrix();
    ofTranslate(ofGetWidth() / -2, ofGetHeight() / -2);
    //ofBackground(0, 0, 0);
    //image.draw(0, 0, 0);
    //ofEnableSmoothing();
    
    mesh.draw();
    ofPopMatrix();
    
    cam.end();
    
}

ofColor ofApp::getColorForSubsection(ofRectangle rect) {
    ofPixels crop;
    
    image.getPixels().cropTo(crop,rect.x,rect.y,rect.width, rect.height);
    
    int r = 0;
    int g = 0;
    int b = 0;
    
    //AVG SAMPLE
    for(int i = 0; i < rect.width; i++) {
        for(int k = 0; k < rect.height; k++) {
            ofColor c = crop.getColor(i, k);
            
            r += c.r;
            g += c.g;
            b += c.b;
        }
    }
    
    int samples = rect.width * rect.height;
    return ofColor(r / samples, g / samples, b / samples);
    
    
    //CENTER SAMPLE
    //return crop.getColor(int(rect.width / 2), int(rect.height / 2));
    
    //img1.getPixelsRef().cropTo(crop,x,y,w,h);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == 's'){

        string n = "screenshot_" + ofGetTimestampString() + ".png";
        ofSaveScreen(n);
        cout << "Screenshot Saved" << endl;

        ofExit();
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

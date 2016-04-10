#include "ofApp.h"

/************ Settings *************/
ofBlendMode BLEND_MODE = OF_BLENDMODE_MULTIPLY;
int const MIN_WIDTH = 10;
int const MAX_WIDTH = 350;
int const HEIGHT = 10; // this also becomes width if RANDOM_WIDTH is false
bool const RANDOM_WIDTH = TRUE;
bool const INFLUENCE_WIDTH = FALSE; //whether the width is adjust pased on position
bool const DRAW_RECT_ROUNDED = FALSE;
bool const DRAW_IMAGE = TRUE;
bool const ANIMATE = FALSE;
string IMAGE = "images/car.png";


ofImage image;
int xMouse = 0;
int yMouse = 0;

ofFbo fbo;

bool hasRendered = false;

//--------------------------------------------------------------
void ofApp::setup(){
    
    //ofImage::grabScreen
    
    //image.jpg / car.png
	bool imageLoaded = image.load(IMAGE);
    
    if(!imageLoaded) {
        cout << "Error: Could not load image. Exiting app." << endl;
        ofExit();
    }
    
    //todo: check if image loaded.
    
	ofSetWindowShape(image.getWidth(), image.getHeight());
	
    fbo.allocate(image.getWidth(), image.getHeight(), GL_RGBA);

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
void ofApp::update(){

    //ofBeginSaveScreenAsPDF("screenshot-"+ofGetTimestampString()+".pdf", false);
    //ofEndSaveScreenAsPDF();
    
    if(hasRendered) {
        return;
    }
    
    fbo.begin();
    ofClear(255,255,255, 0);
    
    //image.rotate90(1);
    
    if(DRAW_IMAGE){
        image.draw(0,0);
    }
    //image.rotate90(-1);
    
    
    ofEnableBlendMode(BLEND_MODE);
    
    
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
            ofSetColor(getColorForSubsection(rect));
             
            ofFill();

            if(DRAW_RECT_ROUNDED) {
                ofDrawRectRounded(k, i, rWidth, rHeight,5);
            } else {
                ofDrawRectangle(k, i, rWidth, rHeight);
            }
            
            k += rWidth;
            
        }
        i += rHeight;
        
    }
    
    fbo.end();
    
    hasRendered = !ANIMATE;
}

//--------------------------------------------------------------
void ofApp::draw(){
    fbo.draw(0,0);
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    if(key == 's'){
        ofImage img;
        
        fbo.readToPixels(img.getPixels());
        
        cout << "Screenshot Saved" << endl;
        
        string n = "screenshot_" + ofGetTimestampString() + ".png";
        img.save(n);
    }
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

    //can move this to a util meshIsInsideWindow
	if (x < 0 || x > ofGetWindowWidth() ||
		y < 0 || y > ofGetWindowHeight()) {
		return;
	}

	xMouse = x;
	yMouse = y;

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    hasRendered = false;
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

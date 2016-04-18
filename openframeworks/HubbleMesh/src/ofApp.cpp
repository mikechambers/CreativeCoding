#include "ofApp.h"

ofImage image;
ofMesh mesh;
ofEasyCam easyCam;
vector<ofVec3f> offsets;

ofMesh meshCopy;
bool orbiting;
float startOrbitTime;

vector<float> distances;
vector<float> angles;
ofVec3f meshCentroid;

bool mouseDisplacement;

//--------------------------------------------------------------
void ofApp::setup(){
    
    ofSetFrameRate(60);
    image.load("car.png");
    image.resize(200,200);
    
    mesh.setMode(OF_PRIMITIVE_POINTS);
    mesh.enableIndices();
    
    mesh.enableColors();
    
    float intensityThreshold = 100.0;
    int w = image.getWidth();
    int h = image.getHeight();
    
    for(int x=0; x < w; ++x) {
        for(int y = 0; y < h; ++y) {
            ofColor c = image.getColor(x, y);
            float intensity = c.getLightness();
            
            if(intensity >= intensityThreshold) {
                
                float saturation = c.getSaturation();
                float z = ofMap(saturation, 0, 255, -100, 100);
                
                //multiply times 4 since we shrunk the image by a factor of 4
                ofVec3f pos(x * 4, y * 4, z);
                mesh.addVertex(pos);
                mesh.addColor(c);
                
                offsets.push_back(
                    ofVec3f(ofRandom(0,100000), ofRandom(0,100000), ofRandom(0,100000)));
            }
        }
        
    }
    
    //cout << mesh.getNumVertices() << endl;
    
    
    float connectionDistance = 30;
    int numVerts = mesh.getNumVertices();
    
    for(int a = 0; a < numVerts; ++a) {
        ofVec3f verta = mesh.getVertex(a);
        
        for(int b = a + 1; b < numVerts; ++b) {
            ofVec3f vertb = mesh.getVertex(b);
            
            float distance = verta.distance(vertb);
            
            if(distance <= connectionDistance) {
                mesh.addIndex(a);
                mesh.addIndex(b);
            }
        }
    }
    
    meshCentroid = mesh.getCentroid();
    
    for(int i = 0; i < numVerts; ++i) {
        ofVec3f vert = mesh.getVertex(i);
        float distance = vert.distance(meshCentroid);
        float angle = atan2(vert.y - meshCentroid.y, vert.x - meshCentroid.x);
        distances.push_back(distance);
        angles.push_back(angle);
    }
    
    orbiting = false;
    startOrbitTime = 0.0;
    meshCopy = mesh;
    
    mouseDisplacement = false;
    
}

//--------------------------------------------------------------
void ofApp::update(){
    
    
    if(mouseDisplacement)
    {
        ofVec3f mouse(mouseX, ofGetWidth() - mouseY, 0);
        
        for(int i = 0 ; i < mesh.getNumVertices(); ++i) {
            ofVec3f vertex = meshCopy.getVertex(i);
            
            float distanceToMouse = mouse.distance(vertex);
            
            float displacement = ofMap(distanceToMouse, 0, 400, 300.0, 0, true);
            
            ofVec3f direction = vertex - mouse;
            
            direction.normalize();
            
            ofVec3f displacedVertext = vertex + displacement * direction;
            mesh.setVertex(i, displacedVertext);
            
        }
    }
    
    if(orbiting) {
        int numVerts = mesh.getNumVertices();
        
        for(int i = 0; i < numVerts; ++i) {
            ofVec3f vert = mesh.getVertex(i);
            
            float distance = distances[i];
            float angle = angles[i];
            float elapsedTime = ofGetElapsedTimef() - startOrbitTime;
            
            float speed = ofMap(distance, 0, 200, 1, 0.25, true);
            
            float rotatedAngle = elapsedTime * speed + angle;
            
            /*
            float time = ofGetElapsedTimef();
            float timeScale = 5.0;
            float displacementScale = 0.75;
            
            ofVec3f timeOffsets = offsets[i];
            
            vert.x += (ofSignedNoise(time * timeScale * timeOffsets.x)) * displacementScale;
            vert.y += (ofSignedNoise(time * timeScale * timeOffsets.y)) * displacementScale;
            vert.z += (ofSignedNoise(time * timeScale * timeOffsets.z)) * displacementScale;
            */
            
            vert.x = distance * cos(rotatedAngle) + meshCentroid.x;
            vert.y = distance * sin(rotatedAngle) + meshCentroid.y;
             
            mesh.setVertex(i, vert);
        }
    }
    
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofColor centerColor = ofColor(85, 78, 68);
    ofColor edgeColor = ofColor(0,0,0);
    ofBackgroundGradient(centerColor, edgeColor, OF_GRADIENT_CIRCULAR);
    
    easyCam.begin();
    
    ofPushMatrix();
        ofTranslate(ofGetWidth() / -2, ofGetHeight() / -2);
        mesh.draw();
    ofPopMatrix();
    easyCam.end();
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
    if(key == 'm') {
        mouseDisplacement = !mouseDisplacement;
        mesh = meshCopy;
    }
    
    if(key == 'o') {
        orbiting = !orbiting;
        startOrbitTime = ofGetElapsedTimef();
        mesh = meshCopy;
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

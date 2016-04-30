
#include "MeshUtils.h"

void MeshUtils::enableScreenShot(string name) {
    _name = name;
    
    //register for event here
    
    ofAddListener(ofEvents().keyPressed, this, &MeshUtils::onKeyPressed);
}

void MeshUtils::enableScreenShot(string name, char key) {
    _screenshotKey = key;
    
    enableScreenShot(name);
}

void MeshUtils::disableScreenShot() {
    ofRemoveListener(ofEvents().keyPressed, this, &MeshUtils::onKeyPressed);
}

void MeshUtils::onKeyPressed(ofKeyEventArgs& eventArgs) {
    
    if(eventArgs.key == _screenshotKey)  {
        string n = "../../../screenshots/" + _name + "_" + ofGetTimestampString() + ".png";
        ofSaveScreen(n);
        cout << "Screenshot Saved : '" + n  + "'"<< endl;
    }
}

/*******************             *******************/


ofVec3f MeshUtils::getRandomPointOnSphere(ofVec3f center, float radius) {
    float u = ofRandomf();
    float v = ofRandomf();
    float theta = 2 * PI * u;
    float phi = acos(2 * v - 1);
    float x = center.x + (radius * sin(phi) * cos(theta));
    float y = center.y + (radius * sin(phi) * sin(theta));
    float z = center.z + (radius * cos(phi));
    
    return ofVec3f(x, y, z);
}

vector<ofVec3f> MeshUtils::getRandomPointsOnSphere(ofVec3f center, float radius, int number) {
    vector<ofVec3f>points;
    
    for(int i = 0; i < number; i++) {
        points.push_back(MeshUtils::getRandomPointOnSphere(center, radius));
    }
    
    return points;
}

ofVec3f MeshUtils::getRandomPointInSphere(ofVec3f center, float radius) {

    ofVec3f out = getRandomPointOnSphere(center, radius);
    
    ofVec3f dir = center - out;
    dir *= ofRandomf();
    
    
    return center + dir;
}

vector<ofVec3f> MeshUtils::getRandomPointsInSphere(ofVec3f center, float radius, int number) {
    vector<ofVec3f>points;
    
    for(int i = 0; i < number; i++) {
        points.push_back(MeshUtils::getRandomPointInSphere(center, radius));
    }
    
    return points;
}

ofVec3f MeshUtils::getRandomPointInBounds(const ofRectangle & bounds) {
    return MeshUtils::getRandomPointInBounds(bounds, 0.0);
}

ofVec3f MeshUtils::getRandomPointInBounds(const ofRectangle & bounds, float depth) {
    float x = ofRandom(bounds.x, bounds.x + bounds.width);
    float y = ofRandom(bounds.y, bounds.y + bounds.height);
    
    
    float z = (depth == 0.0)? 0.0 : ofRandom(-depth / 2, depth / 2);
    
    return ofVec3f(x, y, z);
}


/*******************             *******************/

vector<ofVec3f> MeshUtils::getRandomPointsInBounds(const ofRectangle & bounds, uint number, float depth) {
    vector<ofVec3f>points;
    
    for(int i = 0; i < number; i++) {
        points.push_back(MeshUtils::getRandomPointInBounds(bounds, depth));
    }
    
    return points;
}


vector<ofVec3f> MeshUtils::getRandomPointsInBounds(const ofRectangle & bounds, uint number) {
    return MeshUtils::getRandomPointsInBounds(bounds, number, 0.0);
}

//note, could pass in a vector to populate, so larger vectors dont have to be copied
ofRectangle MeshUtils::getBoundsWithPadding(const ofRectangle & bounds, float padding) {
    float _x = bounds.x + padding;
    float _width = bounds.width - (padding * 2);
    float _y = bounds.y + padding;
    float _height = bounds.height - (padding * 2);
    
    return ofRectangle(_x, _y, _width, _height);
}


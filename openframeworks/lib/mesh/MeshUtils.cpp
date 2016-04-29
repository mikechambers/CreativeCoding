
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

ofVec3f MeshUtils::getRandomPointInBounds(const ofRectangle & bounds) {
    
    float x = ofRandom(bounds.x, bounds.x + bounds.width);
    float y = ofRandom(bounds.y, bounds.y + bounds.height);

    return ofVec3f(x, y, ofRandom(-200.00, 200));
}

vector<ofVec3f> MeshUtils::getRandomPointsInBounds(const ofRectangle & bounds, uint number) {
    
    vector<ofVec3f>points;
    
    for(int i = 0; i < number; i++) {
        points.push_back(MeshUtils::getRandomPointInBounds(bounds));
    }
    
    return points;
}

//note, could pass in a vector to popular, so larger vectors dont have to be copied
ofRectangle MeshUtils::getBoundsWithPadding(const ofRectangle & bounds, float padding) {
    float _x = bounds.x + padding;
    float _width = bounds.width - (padding * 2);
    float _y = bounds.y + padding;
    float _height = bounds.height - (padding * 2);
    
    return ofRectangle(_x, _y, _width, _height);
}


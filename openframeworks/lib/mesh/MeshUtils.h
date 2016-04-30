#ifndef Utils_hpp
#define Utils_hpp

#include <stdio.h>
#include "ofMain.h"

class MeshUtils {
    
private:
    char _screenshotKey = 's';
    string _name;
    
public:
    void enableScreenShot(string name);
    void enableScreenShot(string name, char key);
    
    void onKeyPressed(ofKeyEventArgs& eventArgs);
    void disableScreenShot();

    
    static ofRectangle getBoundsWithPadding(const ofRectangle & bounds, float padding);
    
    static ofVec3f getRandomPointInBounds(const ofRectangle & bounds);
    static ofVec3f getRandomPointInBounds(const ofRectangle & bounds, float depth);
    
    static vector<ofVec3f> getRandomPointsInBounds(const ofRectangle & bounds, uint number);
    static vector<ofVec3f> getRandomPointsInBounds(const ofRectangle & bounds, uint number, float depth);
    
    static ofVec3f getRandomPointInSphere(ofVec3f center, float radius);
    static vector<ofVec3f> getRandomPointsInSphere(ofVec3f center, float radius, int number);

    
    static ofVec3f getRandomPointOnSphere(ofVec3f center, float radius);
    static vector<ofVec3f> getRandomPointsOnSphere(ofVec3f center, float radius, int number);
    
};

#endif /* Follower_hpp */
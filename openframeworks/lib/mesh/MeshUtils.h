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

    static ofVec3f getRandomPointInBounds(const ofRectangle & bounds);
    static ofRectangle getBoundsWithPadding(const ofRectangle & bounds, float padding);
    static vector<ofVec3f> getRandomPointsInBounds(const ofRectangle & bounds, uint number);
};



#endif /* Follower_hpp */
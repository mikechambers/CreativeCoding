#ifndef Utils_hpp
#define Utils_hpp

#include <stdio.h>
#include "ofMain.h"

class MeshUtils {
    
private:
    char _screenshotKey = 's';
    string _dirName;
    
public:
    void enableScreenShot(string dirName);
    void enableScreenShot(string dirName, char key);
    
    void onKeyPressed(ofKeyEventArgs& eventArgs);
    void disableScreenShot();
};

#endif /* Follower_hpp */
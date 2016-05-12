#ifndef Utils_hpp
#define Utils_hpp

#include <stdio.h>
#include "ofMain.h"

enum mPosition { M_LEFT, M_RIGHT, M_CENTER };
enum mSign {M_NEGATIVE = -1, M_POSITIVE = 1, M_ZERO = 0};

class MeshUtils {
    
private:
    char _screenshotKey = 's';
    string _name;
    
public:
    void enableScreenshot(string name);
    void enableScreenshot(string name, char key);
    
    void onKeyPressed(ofKeyEventArgs& eventArgs);
    void disableScreenshot();
};

ofRectangle mGetBoundsWithPadding(const ofRectangle & bounds, float padding);
ofVec3f mGetRandomPointInBounds(const ofRectangle & bounds);
ofVec3f mGetRandomPointInBounds(const ofRectangle & bounds, float depth);
vector<ofVec3f> mGetRandomPointsInBounds(const ofRectangle & bounds, uint number);
vector<ofVec3f> mGetRandomPointsInBounds(const ofRectangle & bounds, uint number, float depth);
ofVec3f mGetRandomPointInSphere(ofVec3f center, float radius);
vector<ofVec3f> mGetRandomPointsInSphere(ofVec3f center, float radius, int number);
ofVec3f mGetRandomPointOnSphere(ofVec3f center, float radius);
vector<ofVec3f> mGetRandomPointsOnSphere(ofVec3f center, float radius, int number);

float mConstrain(float amt, float low, float high);


ofVec3f mGetPointOnCircle(ofVec3f center, float radius, float angle);
ofVec3f mGetPointOnLine(ofVec3f p1, ofVec3f p2, float distance);
ofVec3f mGetPointOnCircleAlongLing(ofVec3f center1, float radius, ofVec3f center2);
float mGetAngleOfLine(ofVec3f p1, ofVec3f p2);

int mFindLeftMostPointIndex(const vector<ofVec3f> & points);

mPosition mGetOrientationOfPointToLine(const ofVec3f & v1, const ofVec3f & v2, const ofVec3f & p);
mSign sign(float n);

vector<ofVec3f> mFindConvexHull(const vector<ofVec3f> & points);

#endif /* Follower_hpp */
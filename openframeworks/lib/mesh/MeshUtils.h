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

ofRectangle meshGetBoundsWithPadding(const ofRectangle & bounds, float padding);
ofVec3f meshGetRandomPointInBounds(const ofRectangle & bounds);
ofVec3f meshGetRandomPointInBounds(const ofRectangle & bounds, float depth);
vector<ofVec3f> meshGetRandomPointsInBounds(const ofRectangle & bounds, uint number);
vector<ofVec3f> meshGetRandomPointsInBounds(const ofRectangle & bounds, uint number, float depth);
ofVec3f meshGetRandomPointInSphere(ofVec3f center, float radius);
vector<ofVec3f> meshGetRandomPointsInSphere(ofVec3f center, float radius, int number);
ofVec3f meshGetRandomPointOnSphere(ofVec3f center, float radius);
vector<ofVec3f> meshGetRandomPointsOnSphere(ofVec3f center, float radius, int number);

float meshConstrain(float amt, float low, float high);


ofVec3f meshGetPointOnCircle(ofVec3f center, float radius, float angle);
ofVec3f meshGetPointOnLine(ofVec3f p1, ofVec3f p2, float distance);
ofVec3f meshGetPointOnCircleAlongLing(ofVec3f center1, float radius, ofVec3f center2);
float meshGetAngleOfLine(ofVec3f p1, ofVec3f p2);

int mFindLeftMostPointIndex(const vector<ofVec3f> & points);

mPosition mGetOrientationOfPointToLine(const ofVec3f & v1, const ofVec3f & v2, const ofVec3f & p);
mSign sign(float n);

vector<ofVec3f> mFindConvexHull(const vector<ofVec3f> & points);

#endif /* Follower_hpp */
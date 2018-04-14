//
//  PointFollower.hpp
//
//  Created by Mike Chambers on 4/19/16.
//
//

#ifndef PointFollower_hpp
#define PointFollower_hpp

#include <stdio.h>
#include "Follower.h"
#include "ofMain.h"

class PointFollower : public Follower {
    
public:
    float hitRadius = 30;
    bool randomOrder = false;
    float pathJitter = 15;
    
    int loops = 0;
    
    const int CURRENT_POINT_INITIALIZATION_VALUE = -42000;
    
    ofVec3f currentPoint;
    
    
    ofVec3f getCurrentPoint();
    ofVec3f getNextPoint();
    
    void update();
    void setPoints(vector<ofVec3f> _points);
    
    PointFollower();

    
private:
    vector<ofVec3f> points;
    int pointIndex = -1;
    //ofVec3f currentTarget;
};


#endif /* Follower_hpp */


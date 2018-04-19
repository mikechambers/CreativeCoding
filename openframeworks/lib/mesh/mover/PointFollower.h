//
//  PointFollower.h
//  MoverRefactorWork
//
//  Created by Mike Chambers on 4/19/18.
//

#ifndef PointFollower_h
#define PointFollower_h

#include <stdio.h>
#include "Follower.h"

class PointFollower : public Follower  {
public:
    float pointHitRadius = 30;
    bool randomOrder = false;
    float pathJitter = 15;
    
    int loops = 0;
    
    ofVec3f getCurrentPoint();
    ofVec3f getNextPoint();
    
    void update() override;
    void setPoints(vector<ofVec3f> _points);
    
    PointFollower();
    
private:
    const int CURRENT_POINT_INITIALIZATION_VALUE = -42000;
    ofVec3f currentPoint;
    vector<ofVec3f> points;
    int pointIndex = 0;
};

#endif /* PointFollower_h */

#include "PointFollower.h"
#include "MeshUtils.h"

PointFollower::PointFollower() {
    attractionCoefficient = 1.8;
    
    currentPoint = ofVec3f(0, 0, CURRENT_POINT_INITIALIZATION_VALUE);
}

void PointFollower::setPoints(vector<ofVec3f> _points) {
    points = _points;
    pointIndex = 0;
}

ofVec3f PointFollower::getCurrentPoint () {
    
    if(pointIndex == -1) {
        cout << "PointFollower::getCurrentTarget points have not been specified" << endl;
        return;
    }
    
    //if it hasnt been initialized yet, get the first point
    if(currentPoint.z == CURRENT_POINT_INITIALIZATION_VALUE) {
        currentPoint = points.at(0);
        pointIndex = 0;
    }
    
    //note: need to check if currentPoint has been initialized
    return currentPoint;
    
}

//should probably make this private
ofVec3f PointFollower::getNextPoint (){
    
    ofVec3f p;
    if(randomOrder) {
        int index = floor(ofRandom(1) * points.size());
        pointIndex = index;
        p = points.at(index);
    } else {
        pointIndex++;
        if(pointIndex == points.size()) {
            loops++;
            pointIndex = 0;
        }
        
        p = points.at(pointIndex);
    }
    
    if(pathJitter) {
        float a = ofRandom(0, pathJitter);
        p = mGetRandomPointOnCircle(p, a);
    }
    
    return p;
}

void PointFollower::update() {
    
    if(pointIndex == -1) {
        return;
    }
    
    ofVec3f tPoint = getCurrentPoint();
    
    if(ofDist(tPoint.x, tPoint.y, location.x, location.y) < hitRadius) {
        tPoint = getNextPoint();
    
        currentPoint = tPoint;
    }

    Follower::update(tPoint);
}

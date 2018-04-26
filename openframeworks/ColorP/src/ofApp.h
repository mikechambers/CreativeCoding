/*
	Copyright Mike Chambers 2018
	mikechambers@gmail.com

	http://www.mikechambers.com
	https://github.com/mikechambers/CreativeCoding

	Released un an MIT License
	https://github.com/mikechambers/CreativeCoding/blob/master/LICENSE.txt
*/

#pragma once

#include "ofMain.h"

class ofApp : public ofBaseApp{

	public:
		void setup();
		void update();
		void draw();
        void init();

		void keyPressed(int key);
		void keyReleased(int key);
		void mouseMoved(int x, int y );
		void mouseDragged(int x, int y, int button);
		void mousePressed(int x, int y, int button);
		void mouseReleased(int x, int y, int button);
		void mouseEntered(int x, int y);
		void mouseExited(int x, int y);
		void windowResized(int w, int h);
		void dragEvent(ofDragInfo dragInfo);
		void gotMessage(ofMessage msg);		
};

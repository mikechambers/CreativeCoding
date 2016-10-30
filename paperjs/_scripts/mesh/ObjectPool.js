/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */

class ObjectPool {

    constructor() {
        this.pool = [];
    };
    
    getObject() {
        var out;

        if (this.pool.length) {
            out = this.pool.pop();
        } else {
            out = {};
        }

        return out;
    };

    returnObject(obj) {
        //NOTE: The object properties are not cleared
        //for performance reasons
        
        //NOTE : We are not checking for duplicates, as it significantly slows
        //down the function with large pools
        
        this.pool.push(obj);
        
        /*
        var hasObject = false;
        
        //http://jsperf.com/caching-array-length/4
        var len = this.pool.length;
        var g;
        while (len--) {
            g = this.pool[len];
            if (g === obj) {
                hasObject = true;
                break;
            }
        }

        if (!hasObject) {
            this.pool.push(obj);
        }
        */
    };
    
}
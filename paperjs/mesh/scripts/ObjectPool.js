/*jslint vars: true, nomen: true, plusplus: true, continue:true, forin:true */

(function () {
    "use strict";

    
    var ObjectPool = function () {
        this.pool = [];
    };
    
    ObjectPool.prototype.getObject = function () {
        var out;

        if (this.pool.length) {
            out = this.pool.pop();
        } else {
            out = {};
        }

        return out;
    };

    ObjectPool.prototype.returnObject = function (obj) {
        //NOTE: The object properties are not cleared
        //for performance reasons
        
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
    };
    
    window.ObjectPool = ObjectPool;
}());
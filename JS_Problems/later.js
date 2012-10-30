/* Write a "later()" method that exists on all objects, which causes a method to be invoked in the future.

The interface is: 

some_obj.later(msec, 'methodName', arg1, arg2, ...)

For example:

var some_obj = {
  sayHi: function(numIter) {
    for(var i=0; i < numIter; i++) {
      console.log("Hiya");
    }
  }
};

Calling some_obj.later(10, 'sayHi', 5) will log 'Hiya' 5 times after a delay of 10 msec. */

if  (typeof Object.prototype.later !== 'function') {
    Object.prototype.later = function(msec,method) {
        var that = this,
            args = Array.prototype.slice.apply(arguments, [2]);
        if (typeof method == 'string') {
		    method = that[method];			
        }
		setTimeout(function() {
			method.apply(that,args);
		}, msec);
		return that;
    }
}

var some_obj = {
  sayHi: function(numIter) {
    for(var i=0; i < numIter; i++) {
      console.debug("Hiya");
    }
  }
};

some_obj.later(10, 'sayHi', 200);
process.stdin.resume();
process.stdin.setEncoding("ascii");
var lineNo = 0;
var bufferObj;
var possibleOps = ["A", "R", "L"];
var nowInsertingElementsFlag = false;
var totalNodesCount = 0;
var nodesCount = 0;

process.stdin.on("data", function (chunk) {
	chunk = chunk.slice(0,-1);
    if (lineNo == 0) {
    	//Initialize circular buffer object.
    	if (!isNaN(chunk)) {
	    	bufferObj = new CircularBuffer();
	    	bufferObj.setSize(parseInt(chunk,10));
	    }
	    lineNo++;
    } else {
    	if (!nowInsertingElementsFlag) {
    		if (chunk.length > 0 && chunk.length < 4 && possibleOps.indexOf(chunk[0].toUpperCase() != -1)) {
				if (chunk[0] == "Q") {
					process.exit();
				} else if (chunk[0] == "L") {
					var items = bufferObj.list();
					if (items) {
						for (var i=0; i<items.length; i++) {
							console.log(items[i]);
						}
					}
				} else if (chunk[0] == "A" || chunk[0] == "R" && chunk[1] == " " && !isNaN(chunk[2])) {
					// ADD or Delete Mode
					if (chunk[0] == "A") {
						totalNodesCount = parseInt(chunk[2],10);
						nowInsertingElementsFlag = true;
					} else if (chunk[0] == "R") {
						if (!bufferObj.remove(parseInt(chunk[2],10))) {
							console.log("Error in removing items from buffer.");
						}

					}
				} else {
					console.log("Not a valid input... Please re-enter.");
				}
    		} else {
    			console.log("Not a valid input... Please re-enter.");
    		}
    	} else {
    		bufferObj.add(chunk);
    		nodesCount++;
    		if (nodesCount == totalNodesCount) {
    			nowInsertingElementsFlag = false;
    			nodesCount = 0;
    		}
    	}
    }
});

function CircularBuffer() {
	var _bufferSize=0;
	var _data = [];
	var _startIndex=-1;
	var _curIndex=-1;

	this.setSize = function(size) {
		_bufferSize = size;
	};

	this.getSize = function() {
		return _bufferSize;
	};

	this.getLength = function() {
		if (_curIndex >= _startIndex)
			return _curIndex - _startIndex + 1;
		else
			return (_bufferSize - _startIndex) + (_curIndex + 1)
	};

	this.add = function(value) {
		if (_startIndex == -1)
			_startIndex = 0;

		if (_curIndex == _bufferSize - 1) {
			if (_startIndex == 0)
				_startIndex++;
			_curIndex = 0;
		} else {
			if (_curIndex + 1 == _startIndex && _curIndex != -1)
				_startIndex++;
			_curIndex++;
		}

		_data[_curIndex] = value;
	};

	this.remove =  function(noOfNodes) {
		if (noOfNodes > _bufferSize) {
			console.log("you cannot remove items more than buffer size.")
			return false;
		}

		if (_startIndex == -1) {
			console.log("no items to remove");
			return false;
		}

		var nodesRemovedCount = 0;

		do {
			if (_startIndex == _curIndex) {
				_startIndex = -1;
				_curIndex = -1;
			} else if (_startIndex == _bufferSize - 1)
				_startIndex = 0;
			else 
				_startIndex++;

			nodesRemovedCount++;
		} while (nodesRemovedCount < noOfNodes)

		return true;
	};

	this.list = function() {
		var items = [];

		if (_startIndex == -1) {
			console.log("no items to list");
			return false;
		}
		
		var index = _startIndex;
		var len = this.getLength();
		var cnt=0;
		do {
			items.push(_data[index]);
			if (index == _bufferSize - 1)
				index = 0;
			else
				index++;
			cnt++;
		} while (cnt < len)
		return items;
	};
}
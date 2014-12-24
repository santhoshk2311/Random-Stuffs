function Solver() {
	var _matrix= [
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1],
		[-1,-1,-1,-1,-1,-1,-1,-1,-1]
	];

	/*
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function checkRow(row, number) {
		for (var j=0; j<9; j++) {
			if (_matrix[row][j] == number)
				return true;
		}
		return false;
	}

	function checkCol(col, number) {
		for (var j=0; j<9; j++) {
			if (_matrix[j][col] == number)
				return true;
		}
		return false;
	}

	function checkBlock(row, col, number) {
		var blocki, blockj, blockPos,x,y;
		var blockRow, blockCol, tmpVal;

		blocki = Math.floor(row / 3);
		blockj = Math.floor(col / 3);
		blockPos = (blocki*3) + blockj;

		x = Math.floor(blockPos / 3) * 3;
		y = Math.floor(blockPos % 3) * 3;

		for (i=0;i<3;i++) {
			blockRow = x + i;
			for (j=0;j<3;j++) {
				blockCol = y + j;
				if (_matrix[blockRow][blockCol] == number)
					return true;
			}
		}
		return false;
	}

	function findUnAssignedLoc() {
		for (var row=0; row<9; row++) {
			for (var col=0; col<9; col++) {
				if (_matrix[row][col] == -1) {
					return {
						row:row,
						col:col
					};
				}
			}
		}
		return {
			row: -1,
			col: -1
		};
	}

	function validNumber(locObj, number) {
		return !checkRow(locObj.row,number) && !checkCol(locObj.col,number) && !checkBlock(locObj.row, locObj.col, number);
	}

	var solvePuzzle = function() {
		var row,col;

		var locObj = findUnAssignedLoc();

		if (locObj.row == -1 || locObj.col == -1) {
			return true;
		} else {
			var valuesAr = [];
			var randomNumber;

			do {
				randomNumber = getRandomInt(1,9);
				if(valuesAr.indexOf(randomNumber) == -1) {
					valuesAr.push(randomNumber);
				}	
			} while(valuesAr.length < 9)

			for (var i=0; i<9; i++) {
				if (validNumber(locObj, valuesAr[i])) {
					_matrix[locObj.row][locObj.col] = valuesAr[i];

					if (solvePuzzle())
						return true;

					_matrix[locObj.row][locObj.col] = -1;
				}
			}
		}
		return false;
	};

	this.getMatrix = function() {
		solvePuzzle();
		return _matrix;
	}

}
/*
 *	Sudoku Game Class. Defined inside UI class.
 *  Has all game logic like GenerateBoard, Solve, Validate etc.
 */
function Game() {
	//Private Game Properties
	var _sudokuMatrix;
	var _solvedMatrix;
	var _difficultyLevel=0;
	var _validationMatrix = [
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

	//Private Game Class Methods

	/*
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/*
	 * Given solved sudoku matrix, returns matrix for sudoku board.
	 */
	function pickRandomFromMatrix(solvedMatrix) {
		var randomNumber,row, col,i=0;
		var editableNodeCount;
		if (_difficultyLevel == 0) {
			editableNodeCount = 42;
		} else if (_difficultyLevel == 1) {
			editableNodeCount = 45;
		} else if (_difficultyLevel == 2) {
			editableNodeCount = 50;
		}

		while (i < editableNodeCount) {
			randomNumber = getRandomInt(0,80);
			row = Math.floor(randomNumber/9);
			col = Math.floor(randomNumber%9);
			if (solvedMatrix[row][col] != -1) {
				i++;
				solvedMatrix[row][col] = -1;
			}
		}
		return solvedMatrix;
	}

	/*
	 *	Function that generates board for the game.
	 *  Returns matrix that is generated for the game.
	 */
	var generateBoardMatrix = function() {
		var solver = new Solver();
		_solvedMatrix =  solver.getMatrix();
		_sudokuMatrix = pickRandomFromMatrix(jQuery.extend(true, {}, _solvedMatrix));
		return _sudokuMatrix;
	};

	


	/*
	 * Utility function. 
	 * Takes row and col index and returns block position (0..8)
	 */
	var getBlockPos = function(row, col) {
		var blocki = Math.floor(row / 3);
		var blockj = Math.floor(col / 3);
		 //convert blocki,blockj to singleD blockAr pos;
		var blockPos = (blocki*3) + blockj;
		return blockPos;
	}

	var validateRows = function(sudokuMatrix) {
		var inputVal;
		for(var i = 0; i < 9; i++) {
			var rowVals = [];
			for(var j = 0; j < 9; j++) {
				inputVal =  sudokuMatrix[i][j];
				if(inputVal >=1 && inputVal <=9) {
					rowVals.push(inputVal);
				}	
			}
			if(containsDuplicate(rowVals)) {
				for(var k = 0; k < 9; k++) {
					_validationMatrix[i][k] = -1;	
				}
			}	
		}
	}

	var validateCols = function(sudokuMatrix) {
		var inputVal;
		for(var i = 0; i < 9; i++) {
			var colVals = [];
			for(var j = 0; j < 9; j++) {
				inputVal =  sudokuMatrix[j][i];
				if(inputVal >=1 && inputVal <=9) {
					colVals.push(inputVal);
				}	
			}
			if(containsDuplicate(colVals)) {
				for(var k = 0; k < 9; k++) {
					_validationMatrix[k][i] = -1;
				}
			}
		}
	}

	var validateBlocks = function(sudokuMatrix) {
		var inputVal;
		for(var i = 0; i < 9; i++) {
			var blockVals = [];
			var blockRowStartPos = i - (i%3);
			var blockColStartPos = (i % 3 ) * 3;
			for(var j = 0; j < 9; j++) {
				var rowB = Math.floor(blockRowStartPos + j / 3);
				var colB = Math.floor(blockColStartPos + j % 3);
				inputVal =  sudokuMatrix[rowB][colB];
				if(inputVal >=1 && inputVal <=9) {
					blockVals.push(inputVal);
				}	
			}
			if(containsDuplicate(blockVals)) {
				for(var k = 0; k < 9; k++) {
					var rowB = Math.floor(blockRowStartPos + k / 3);
					var colB = Math.floor(blockColStartPos + k % 3);
					_validationMatrix[rowB][colB] = -1;
				}
			}
		}
	}

	var resetValidationMatrix = function() {
		for(var i =0; i < 9; i++) {
			for(var j = 0; j < 9; j++) {
				_validationMatrix[i][j] = 0;
			}
		}
	}

	var containsDuplicate = function(arr) {
		if(!arr) return false;

		var sorted_arr = arr.sort();
		for (var i = 0; i < arr.length - 1; i++) {
		    if (sorted_arr[i + 1] == sorted_arr[i]) {
		        return true;
		    }
		}
		return false;
	}

	//Public Game Class Methods.

	/*
	 * validate when a number is entered.
	 */
	this.validate = function(sudokuMatrix) {
		resetValidationMatrix();
		validateRows(sudokuMatrix);
		validateCols(sudokuMatrix);
		validateBlocks(sudokuMatrix);
		return _validationMatrix;
	};

	/*
	 * Function sets game difficulty level.
	 */
	this.setDifficultyLevel = function(difficultyLevel) {
		_difficultyLevel = difficultyLevel;
	};

	/*
	 * Function returns game difficulty level.
	 */
	this.getDifficultyLevel = function() {
		return _difficultyLevel;
	};

	/*
	 * Function returns solved matrix.
	 */
	this.getSolvedMatrix = function() {
		return _solvedMatrix;
	};

	/*
	 * Function returns solved matrix.
	 */
	this.getSudokuMatrix = function() {
		return _sudokuMatrix;
	}

	/*
	 * Public Function exposed to UI Class to generate new board.
	 * returns matrix.
	 */
	this.createBoardMatrix =  function() {
		var matrix = generateBoardMatrix();
		return matrix;
	};
} // Game Class Ends.
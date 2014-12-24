/*
 *	Sudoku Game Class. Defined inside UI class.
 *  Has all game logic like GenerateBoard, Solve, Validate etc.
 */
function Game() {
	//Private Game Properties
	var _sudokuMatrix;
	var _solvedMatrix;
	var _difficultyLevel=0;
	var _validationMatrix = {
		rowi:[],
		colj:[],
		blockij:[]
	};

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

	/*
	 * Function that calculates _validationMatrix after new board is generated.
	 */
	var calculateValidationMatrix = function(sudokuMatrix) {
		var blockPos, data;
		for (i=0; i<9; i++) {
			_validationMatrix.rowi[i] = [];
			for (j=0; j<9; j++) {
				//initialize col array if not available.
				if (!_validationMatrix.colj[j])
					_validationMatrix.colj[j] = [];

				blockPos = getBlockPos(i,j);
				//initialize block array if not available.
				if (!_validationMatrix.blockij[blockPos])
					_validationMatrix.blockij[blockPos] = [];
				
				data = sudokuMatrix[i][j];
				if (data >=1 && data <=9) {
					_validationMatrix.rowi[i].push(data);
					_validationMatrix.colj[j].push(data);
					_validationMatrix.blockij[blockPos].push(data);
				}
			}
		}
	};

	/*
	 * Function that adds data to _validationMatrix everytime when
	 * user enters data in UI.
	 */
	var addDataToValidationMatrix = function(row, col, val) {
		if (isNaN(val))
			return;
		//update row array
		if (!_validationMatrix.rowi[row])
			_validationMatrix.rowi[row] = [];
		_validationMatrix.rowi[row].push(val);

		//update col array
		if (!_validationMatrix.colj[col])
			_validationMatrix.colj[col] = [];
		_validationMatrix.colj[col].push(val);

		//update block array
		if (!_validationMatrix.blockij[getBlockPos(row,col)])
			_validationMatrix.blockij[getBlockPos(row,col)] = [];
		_validationMatrix.blockij[getBlockPos(row,col)].push(val);
	};

	/*
	 * Function that deletes data to _validationMatrix everytime when
	 * user deletes data in UI.
	 */
	var deleteDataFromValidationMatrix = function(row, col, val) {
		var index,blockPos;

		if (isNaN(val))
			return;

		if (_validationMatrix.rowi[row]) {
			index = _validationMatrix.rowi[row].indexOf(val);
			if (index > -1) {
				_validationMatrix.rowi[row].splice(index,1);
			}
		}

		if (_validationMatrix.colj[col]) {
			index = _validationMatrix.colj[col].indexOf(val);
			if (index > -1) {
				_validationMatrix.colj[col].splice(index,1);
			}
		}

		blockPos = getBlockPos(row,col);

		if (_validationMatrix.blockij[blockPos]) {
			index = _validationMatrix.blockij[blockPos].indexOf(val);
			if (index > -1) {
				_validationMatrix.blockij[blockPos].splice(index,1);
			}
		}
	};

	//Public Game Class Methods.

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
		calculateValidationMatrix(matrix);
		return matrix;
	};

	/*
	 *  Public Function exposed to UI Class to validate user input.
	 *  Returns true if success.
	 *  Returns failure info like Row/Column/Block in an object.
		 */
	this.validate = function(row, col, val, oldval) {

		// Delete old value first from validation matrix.
		deleteDataFromValidationMatrix(row,col,oldval);

		// Check if the new val is already availble in the
		// specfic row/column/block validation matrix object.
		var rowCheck = _validationMatrix.rowi[row].indexOf(val);
		var colCheck = _validationMatrix.colj[col].indexOf(val)
		var blockCheck = _validationMatrix.blockij[getBlockPos(row,col)].indexOf(val);

		// Adds new value to validation matrix.
		addDataToValidationMatrix(row,col,val);

		if (rowCheck == -1 && colCheck == -1 && blockCheck == -1) {
			// Validation success.
			return true;
		} else {
			// Validation Failed.
			return {
				'rowFail': rowCheck != -1,
				'colFail': colCheck != -1,
				'blockFail': blockCheck != -1
			};
		}
	}
} // Game Class Ends.
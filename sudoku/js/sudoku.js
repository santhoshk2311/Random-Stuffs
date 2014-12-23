/*
 *	Sudoku Class.
 *  Singleton.
 *  @author santhoshkumar soundararajan
 */
var Sudoku = (function($) {
	var _instance;
	var _gameUI;

	/*
	 *  Function that instantiates Sudoku UI Class.
	 */
	function init() {
		_gameUI = new SudokuGameUI();
		return {
			drawUI: function() {
				$('#center').append(_gameUI.constructBoardUI());
				_gameUI.addTimer();
			}
		};
	}

	/*
	 *	Sudoku Game UI Class.
	 *  constructs UI board.
	 */

	function SudokuGameUI() {
		var _gameObj;

		/*
		 *	Sudoku Game Class. Defined inside UI class.
		 *  Has all game logic like GenerateBoard, Solve, Validate etc.
		 */
		function Game() {
			//Private Game Properties
			var _sudokuMatrix;
			var _validationMatrix = {
				rowi:[],
				colj:[],
				blockij:[]
			};

			//Private Game Class Methods

			/*
			 *	Function that generates board for the game.
			 *  Returns matrix that is generated for the game.
			 */
			var generateBoardMatrix = function() {
				_sudokuMatrix = [];
				_sudokuMatrix = [
					[5,3,'x','x',7,'x','x','x','x'],
					[6,'x','x',1,9,5,'x','x','x'],
					['x',9,8,'x','x','x','x',6,'x'],
					[8,'x','x','x',6,'x','x','x',3],
					[4,'x','x',8,'x',3,'x','x',1],
					[7,'x','x','x',2,'x','x','x',6],
					['x',6,'x','x','x','x',2,8,'x'],
					['x','x','x',4,1,9,'x','x',5],
					['x','x','x','x',8,'x','x',7,9]
				];
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
				for (i=0; i<9; i++) {
					_validationMatrix.rowi[i] = [];
					for (j=0; j<9; j++) {
						//initialize col array if not available.
						if (!_validationMatrix.colj[j])
							_validationMatrix.colj[j] = [];

						var blockPos = getBlockPos(i,j);
						//initialize block array if not available.
						if (!_validationMatrix.blockij[blockPos])
							_validationMatrix.blockij[blockPos] = [];
						
						var data = sudokuMatrix[i][j];
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
				var index;

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

				var blockPos = getBlockPos(row,col);

				if (_validationMatrix.blockij[blockPos]) {
					index = _validationMatrix.blockij[blockPos].indexOf(val);
					if (index > -1) {
						_validationMatrix.blockij[blockPos].splice(index,1);
					}
				}
			};

			//Public Game Class Methods.

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

		// Private UI Class methods.

		/*
		 *  Utility function that returns input node from Table give row and col.
 		 */
		var getInputNodeFromTable = function(row, col) {
			var table = $('#sudokuTable')[0];
			var cell = table.rows[row].cells[col];
			var input = $(cell).find("input");
			return input;
		};

		/*
		 *  Utility function that adds error class to input node.
		 *  Also increments error counter in the input node after showing error.
 		 */
		var addErrorClass = function(inputNode) {
			if (!inputNode)
				return;
			else {
				var errCnt = inputNode.data("error-counter");
				return inputNode.addClass("error-bg-color").data("error-counter",++errCnt);
			}
		};

		/*
		 *  Utility function that removes error class to input node.
		 *  Also decrements error counter in the input node after removing error.
 		 */
		var removeErrorClass = function(inputNode) {
			if (!inputNode)
				return;
			else {
				var errCnt = inputNode.data("error-counter");
				if (errCnt > 0) {
					--errCnt;
					inputNode.data("error-counter", errCnt);
					if (errCnt == 0) {
						inputNode.removeClass("error-bg-color");	
					}
				}
			}
		};

		/*
		 *  Function that highlight/unhighlight errors after validation.
		 *  Takes rowIndex, colIndex, blockIndex and hightLightBool.
		 *  Highlight errors when highLightBool is true. 
		 *  Unhighlight errors when highLightBool is false.
 		 */
		var highlightErrors = function(rowIndex, colIndex, blockIndex, highLightBool) {
			var cell,x,y,row,col;

			var input,errCnt;

			for (var j=0;j<9;j++) {
				if (rowIndex != -1) {
					input = getInputNodeFromTable(rowIndex, j);
					if (highLightBool) {
						addErrorClass(input);
					} else if (!highLightBool) {
						removeErrorClass(input);
					}
				}
				if (colIndex != -1) {
					input = getInputNodeFromTable(j, colIndex);
					if (highLightBool) {
						addErrorClass(input);
					} else if (!highLightBool) {
						removeErrorClass(input);
					}
				}
			}
			if (blockIndex != -1) {
				x = Math.floor(blockIndex / 3) * 3;
				y = Math.floor(blockIndex % 3) * 3;
				for (i=0;i<3;i++) {
					row = x + i;
					for (j=0;j<3;j++) {
						col = y + j;
						input = getInputNodeFromTable(row, col);

						if (highLightBool) {
							addErrorClass(input);
						} else {
							removeErrorClass(input);
						}
					}
				}
			}
		};

		//Public UI Class Methods.

		this.addTimer = function() {

		};

		/*
		 *  Public Function exposed to construct Sudoku Board UI with data.
		 *  Returns TABLE DOM that will get added inside center container div.
 		 */
		this.constructBoardUI = function() {
			var gameObj = this.getGameUIInstance();
			var cellData = gameObj.createBoardMatrix();

			var table = $('<table id="sudokuTable"></table>').addClass("fit");
			for(var i=0; i<9; i++) {
			    var rowTr = $('<tr></tr>');
			    for (var j=0; j<9; j++) {
			    	var data = cellData[i][j];
			    	var input = $('<input type="text"/>').attr({
			    		'maxlength': "2",
			    		'min': '1',
			    		'max': '9'});

			    	if (data >= 1 && data <=9) {
			    		input.attr({
			    			'value' : data,
			    			'disabled': true,
			    		}).addClass("disabled-content").data("can-edit",false);
			    	} else if (data == 'x') {
			    		input.data("can-edit", true);	
			    	}

			    	input.data("index", {row:i, col:j});
			    	input.data("error-counter",0);
			    	input.keyup()

			    	input.keyup(function(){
			    		var oldval = $(this).data("oldval");
			    		var val = $(this).val();

			    		var preval;
			    		var rowFailData, colFailData, blockFailData;

			    		if (val.length == 2) {
			    			preval = val[0];
			    			val = val[1];
			    		} 

			    		if (!$.isNumeric(val) || val == 0) {
			    			val = '';
			    		}

			    		if (preval && val == '')
			    			this.value = preval;

			    		if (oldval == val) {
			    			this.value = val;
			    			return;
			    		}

			    		var index = $(this).data("index");

			    		var validate = gameObj.validate(index.row,index.col,parseInt(val,10), parseInt(oldval,10));

			    		if (validate !== true) {
			    			rowFailData = validate.rowFail;
			    			colFailData = validate.colFail;
			    			blockFailData = validate.blockFail;
			    			
			    			$(this).data("row-error",rowFailData);
			    			$(this).data("col-error",colFailData);
			    			$(this).data("block-error",blockFailData);

			    			var rowVal = (rowFailData)?index.row:-1;
			    			var colVal = (colFailData)?index.col:-1;
			    			var blocki = Math.floor(index.row / 3);
			    			var blockj = Math.floor(index.col / 3);
							var blockPos = (blocki*3) + blockj;
			    			var blockVal = (blockFailData) ? blockPos :-1;
			    			highlightErrors(rowVal, colVal, blockVal, true);

			    			var table = $('#sudokuTable')[0];

			    			for (var k=0; k<9; k++) {
			    				if (rowFailData) {
			    					if (index.col != k) {
				    					cell = table.rows[index.row].cells[k];
										var inputNode = $(cell).find("input");
				    					if (inputNode.data("can-edit") && inputNode.data("val") == val) {
											inputNode.data("row-error", true);
										}
									}
			    				}
			    				if (colFailData) {
			    					if (index.row != k) {
			    						cell = table.rows[k].cells[index.col];
										var inputNode = $(cell).find("input");
				    					if (inputNode.data("can-edit") && inputNode.data("val") == val) {
											inputNode.data("col-error", true);
										}
			    					}
			    				}
			    				if (blockVal != -1) {
									x = Math.floor(blockVal / 3) * 3;
									y = Math.floor(blockVal % 3) * 3;
									for (var i=0;i<3;i++) {
										row = x + i;
										for (var j=0;j<3;j++) {
											col = y + j;
											if (index.row == row && index.col == col) {
												continue;
											}
											cell = table.rows[row].cells[col];
											var inputNode = $(cell).find("input");
					    					if (inputNode.data("can-edit") && inputNode.data("val") == val) {
												inputNode.data("block-error", true);
											}
										}
									}
								}
			    			}

			    		} else {
			    			rowFailData = $(this).data("row-error");
			    			colFailData = $(this).data("col-error");
			    			blockFailData = $(this).data("block-error");
			    			var rowVal = (rowFailData) ? index.row : -1;
			    			var colVal = (colFailData) ? index.col : -1;
			    			var blocki = Math.floor(index.row / 3);
			    			var blockj = Math.floor(index.col / 3);
							var blockPos = (blocki*3) + blockj;
							var blockVal = (blockFailData) ? blockPos : -1;
			    			highlightErrors(rowVal, colVal, blockVal,false);
			    		}
			    		$(this).data("oldval",val);
			    		$(this).data("val",val);
			    		this.value = val;	
			    	});

			    	var td = $('<td>');

			    	var blocki = Math.floor(i / 3);
			    	var blockj = Math.floor(j / 3);

			    	if ((blocki + blockj) % 2 == 0) {
			    		input = input.addClass("bg-color2");
					} else {
						input = input.addClass("bg-color1");
					}
			    	rowTr.append(td.append(input));
			    }
			    table.append(rowTr);
			}
			return table;
		};

		/*
		 *  Public Function exposed get the singleton UI instance.
		 *  Returns true if success.
		 *  Returns failure info like Row/Column/Block in an object.
 		 */
		this.getGameUIInstance = function() {
			if (!_gameObj) {
				// If no instance created before, create new instance.
				_gameObj = new Game();
				return _gameObj;
			} else {
				// return old UI instance.
				return _gameObj;
			} 
		};
	} // UI Class Ends.

	// Exposed Public methods of Singleton class.
	return {
		getInstance: function () {
			if (!_instance) {
	    	    _instance = init();
	    	}
    		return _instance;
		}
	}
}) (jQuery);
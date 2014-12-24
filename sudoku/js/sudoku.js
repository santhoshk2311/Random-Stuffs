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
				_gameUI.addTimer();
				$('#center').append(_gameUI.constructBoardUI());
			}
		};
	}

	/*
	 *	Sudoku Game UI Class.
	 *  constructs UI board.
	 */

	function SudokuGameUI() {
		var _gameObj;
		var _lastSelectedCellObj; // Stores last selected cell obj.
		var _lastSelectedFailObj; // Stores last failed cell obj.
		var _timerObj; // Stores id for the running timer.
		var _timerPausedFlag = false;


		/*
		 *  Timer Class.
		 */
		function Timer(timerCmp) {
			var _seconds=0;
			var _minutes=0;
			var _hours=0;
			var _timerId;
			var publicTimerMethods;
			var _timerCmp = timerCmp;

			var addSecond = function() {
				var textContent;
				_seconds++;
				if (_seconds >= 60) {
					_seconds = 0;
					_minutes++;
			        if (_minutes >= 60) {
			            _minutes = 0;
			            _hours++;
			        }
				}
				textContent = (_hours ? (_hours > 9 ? _hours : "0" + _hours) : "00") + 
					":" + (_minutes ? (_minutes > 9 ? _minutes : "0" + _minutes) : "00") +
					":" + (_seconds > 9 ? _seconds : "0" + _seconds);

				_timerCmp.text(textContent);
				publicTimerMethods.runTimer();	
			};

			publicTimerMethods = {	
				runTimer: function() {
					_timerId = setTimeout(addSecond, 1000);
				},
				pauseTimer: function() {
					if (_timerId)
						clearTimeout(_timerId);
				},
				stopTimer: function() {
					if (_timerId) {
						clearTimeout(_timerId);
						_timerId = undefined;
						_timerCmp = '';
					}
				}
			};
			return publicTimerMethods;
		}

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
			var errCnt;
			if (!inputNode)
				return;
			else {
				errCnt = inputNode.data("error-counter");
				return inputNode.addClass("error-bg-color").data("error-counter",++errCnt);
			}
		};

		/*
		 *  Utility function that removes error class to input node.
		 *  Also decrements error counter in the input node after removing error.
 		 */
		var removeErrorClass = function(inputNode) {
			var errCnt;
			if (!inputNode)
				return;
			else {
				errCnt = inputNode.data("error-counter");
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

		var attachEvents = function(input,gameObj,gameUIObj) {
			$(".restart").unbind();
			$(".restart").click(function() {
				gameUIObj.restartGame();
			});

			$("#timerDiv").unbind();
			$("#timerDiv").click(function() {
				if (!_timerPausedFlag) {
					_timerPausedFlag = true;
					_timerObj.pauseTimer();
					
				} else {
					_timerPausedFlag = false;
					_timerObj.runTimer();
				}
			});

			// Attaching events to handle arrow keys.
			input.keydown(function(e) {
				var indexObj = $(this).data("index");
				var index;
				var currentTd, currentTr, nextTd, nextTr,input,nextInput;

				if (!indexObj)
					return;

			    switch(e.which) {
			        case 37: // left
			        	currentTd = $(this).parent();
			        	input = $(this);
			        	input.focus();

			        	if(currentTd.is(':first-child')) {
						    return;
						}
						nextTd = currentTd.prev();
						nextInput = nextTd.find("input");

						while (nextInput.prop("disabled")) {
							nextTd = nextTd.prev();
							nextInput = nextTd.find("input");
						}
						nextInput.focus();
			        break;

			        case 38: // up
			        	currentTd = $(this).parent();
			        	currentTr = currentTd.parent();
			        	index = currentTd.index();
			        	input = $(this);
			        	input.focus();

			        	if(currentTr.is(':first-child')) {
						    return;
						}
						nextTr = currentTr.prev();
						nextTd = nextTr.find("td").eq(index);
						nextInput = nextTd.find("input");

						while (nextInput.prop("disabled")) {
							nextTr = nextTr.prev();
							nextTd = nextTr.find("td").eq(index);
							nextInput = nextTd.find("input");
						}
						nextInput.focus();
			        break;

			        case 39: // right
			        	currentTd = $(this).parent();
			        	input = $(this);
			        	input.focus();

			        	if(currentTd.is(':last-child')) {
						    return;
						}
						nextTd = currentTd.next();
						nextInput = nextTd.find("input");

						while (nextInput.prop("disabled")) {
							nextTd = nextTd.next();
							nextInput = nextTd.find("input");
						}
						nextInput.focus();
			        break;

			        case 40: // down
			        	currentTd = $(this).parent();
			        	currentTr = currentTd.parent();
			        	index = currentTd.index();
			        	input = $(this);
			        	input.focus();

			        	if(currentTr.is(':last-child')) {
						    return;
						}
						nextTr = currentTr.next();
						nextTd = nextTr.find("td").eq(index);
						nextInput = nextTd.find("input");

						while (nextInput.prop("disabled")) {
							nextTr = nextTr.next();
							nextTd = nextTr.find("td").eq(index);
							nextInput = nextTd.find("input");
						}
						nextInput.focus();
			        break;

			        default: return; // exit this handler for other keys
			    }
			    e.preventDefault(); // prevent the default action (scroll / move caret)
			});

			//Attaching Key UP event.
			//This is one of the key callback function.
			input.keyup(function(){
	    		var oldval = $(this).data("oldval");
	    		var val = $(this).val();
	    		var preval;
	    		var rowFailData, colFailData, blockFailData;
	    		var index = $(this).data("index");
	    		var rowVal,colVal,blocki,blockj,blockPos,blockVal;
	    		var table = $('#sudokuTable')[0];
	    		var validate, inputNode;

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

	    		validate = gameObj.validate(index.row,index.col,parseInt(val,10), parseInt(oldval,10));

	    		if (validate !== true) {

	    			// If we enter 2 wrong values continously. Unhighlight first highligted rows/cols/blocks.
	    			if (_lastSelectedCellObj == index && _lastSelectedFailObj) {
	    				rowFailData = _lastSelectedFailObj.rowFail;
		    			colFailData = _lastSelectedFailObj.colFail;
		    			blockFailData = _lastSelectedFailObj.blockFail;

		    			rowVal = (rowFailData)?index.row:-1;
		    			colVal = (colFailData)?index.col:-1;
		    			blocki = Math.floor(index.row / 3);
		    			blockj = Math.floor(index.col / 3);
						blockPos = (blocki*3) + blockj;
		    			blockVal = (blockFailData) ? blockPos :-1;

		    			highlightErrors(rowVal, colVal, blockVal, false);
	    			}

	    			rowFailData = validate.rowFail;
	    			colFailData = validate.colFail;
	    			blockFailData = validate.blockFail;
	    			
	    			$(this).data("row-error",rowFailData);
	    			$(this).data("col-error",colFailData);
	    			$(this).data("block-error",blockFailData);

	    			rowVal = (rowFailData)?index.row:-1;
	    			colVal = (colFailData)?index.col:-1;
	    			blocki = Math.floor(index.row / 3);
	    			blockj = Math.floor(index.col / 3);
					blockPos = (blocki*3) + blockj;
	    			blockVal = (blockFailData) ? blockPos :-1;

	    			highlightErrors(rowVal, colVal, blockVal, true);

	    			_lastSelectedFailObj = validate;

	    			for (var k=0; k<9; k++) {
	    				if (rowFailData) {
	    					if (index.col != k) {
		    					cell = table.rows[index.row].cells[k];
								inputNode = $(cell).find("input");
		    					if (inputNode.data("can-edit") && inputNode.data("val") == val) {
									inputNode.data("row-error", true);
								}
							}
	    				}
	    				if (colFailData) {
	    					if (index.row != k) {
	    						cell = table.rows[k].cells[index.col];
								inputNode = $(cell).find("input");
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
									inputNode = $(cell).find("input");
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
	    			rowVal = (rowFailData) ? index.row : -1;
	    			colVal = (colFailData) ? index.col : -1;
	    			blocki = Math.floor(index.row / 3);
	    			blockj = Math.floor(index.col / 3);
					blockPos = (blocki*3) + blockj;
					blockVal = (blockFailData) ? blockPos : -1;
	    			highlightErrors(rowVal, colVal, blockVal,false);
	    			$(this).data("row-error",false);
	    			$(this).data("col-error",false);
	    			$(this).data("block-error",false);
	    			_lastSelectedFailObj = {rowFailData:false, colFailData: false, rowFailData: false};
	    		}
	    		_lastSelectedCellObj = index;
	    		$(this).data("oldval",val);
	    		$(this).data("val",val);
	    		this.value = val;	
	    	});
		};

		//Public UI Class Methods.

		/*
		 *  Public function to add Timer in UI.
 		 */
		this.addTimer = function() {
			if (_timerObj) {
				_timerObj.pauseTimer();
			}
			_timerObj = new Timer($("#timerDiv"));
			_timerObj.runTimer();
		};

		/*
		 *  Public function to restart Timer in UI.
 		 */
		this.restartTimer = function() {
			if (_timerObj) {
				_timerObj.pauseTimer();
			}
			_timerObj =new Timer($("#timerDiv"));
			_timerObj.runTimer();
		};

		this.restartGame = function() {
			//Stop old timer.
			_timerObj.stopTimer();

			// Clear state variables.
			delete _lastSelectedCellObj;
			delete _lastSelectedFailObj;
			delete _timerObj;
			delete _timerPausedFlag;

			//Remove old table UI from main container.
			$('#center').empty();

			//draw UI again.
			_gameUI.addTimer();
			$('#center').append(_gameUI.constructBoardUI());
		}
		/*
		 *  Public Function exposed to construct Sudoku Board UI with data.
		 *  Returns TABLE DOM that will get added inside center container div.
 		 */
		this.constructBoardUI = function() {
			var gameObj = this.getGameUIInstance();
			var cellData = gameObj.createBoardMatrix();
			var data, input, td, blocki, blockj;

			var table = $('<table id="sudokuTable"></table>').addClass("fit");
			for(var i=0; i<9; i++) {
			    var rowTr = $('<tr></tr>');
			    for (var j=0; j<9; j++) {
			    	data = cellData[i][j];
			    	input = $('<input type="text"/>').attr({
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

			    	attachEvents(input,gameObj,_gameUI);

			    	td = $('<td>');

			    	blocki = Math.floor(i / 3);
			    	blockj = Math.floor(j / 3);

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
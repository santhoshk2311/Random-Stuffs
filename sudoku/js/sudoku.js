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
				$('#center').append(_gameUI.restartGame(true));
			}
		};
	}

	/*
	 *	Sudoku Game UI Class.
	 *  constructs UI board.
	 */

	function SudokuGameUI() {
		var _gameObj;
		var _currentSudokuMatrix;
		var _lastSelectedCellObj; // Stores last selected cell obj.
		var _lastSelectedFailObj; // Stores last failed cell obj.
		var _timerObj; // Stores id for the running timer.
		var _timerPausedFlag = false;
		var _difficultyLevel = 0;

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
				return inputNode.addClass("error-bg-color");
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
				inputNode.removeClass("error-bg-color");
			}
		};

		var unhighlightTable = function() {
			for(var i = 0; i < 9; i++) {
				for(var j = 0; j < 9; j++) {
					removeErrorClass(getInputNodeFromTable(i, j));
				}
			}		
		}

		var validateRows = function() {
			var inputNode;
			var inputVal;
			for(var i = 0; i < 9; i++) {
				var rowVals = [];
				for(var j = 0; j < 9; j++) {
					inputNode = $($('#sudokuTable')[0].rows[i].cells[j]).find("input");
					inputVal =  parseInt(inputNode.val(), 10);
					if(!isNaN(inputVal)) {
						rowVals.push(inputVal);
					}	
				}
				if(containsDuplicate(rowVals)) {
					for(var k = 0; k < 9; k++) {
						addErrorClass(getInputNodeFromTable(i, k));
					}
				}
			}
		}

		var validateCols = function() {
			var inputNode;
			var inputVal;
			for(var i = 0; i < 9; i++) {
				var colVals = [];
				for(var j = 0; j < 9; j++) {
					inputNode = $($('#sudokuTable')[0].rows[j].cells[i]).find("input");
					inputVal =  parseInt(inputNode.val(), 10);
					if(!isNaN(inputVal)) {
						colVals.push(inputVal);
					}	
				}
				if(containsDuplicate(colVals)) {
					for(var k = 0; k < 9; k++) {
						addErrorClass(getInputNodeFromTable(k, i));
					}
				}
			}
		}

		var validateBlocks = function() {
			var inputNode;
			var inputVal;
			for(var i = 0; i < 9; i++) {
				var blockVals = [];
				var blockRowStartPos = i - (i%3);
				var blockColStartPos = (i % 3 ) * 3;
				for(var j = 0; j < 9; j++) {
					var rowB = Math.floor(blockRowStartPos + j / 3);
					var colB = Math.floor(blockColStartPos + j % 3);
					inputNode = $($('#sudokuTable')[0].rows[rowB].cells[colB]).find("input");
					inputVal =  parseInt(inputNode.val(), 10);
					if(!isNaN(inputVal)) {
						blockVals.push(inputVal);
					}	
				}
				if(containsDuplicate(blockVals)) {
					for(var k = 0; k < 9; k++) {
						var rowB = Math.floor(blockRowStartPos + k / 3);
						var colB = Math.floor(blockColStartPos + k % 3);
						addErrorClass(getInputNodeFromTable(rowB, colB));
					}
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

		var validateTableHighlightError = function() {
			unhighlightTable();
			validateRows();
			validateCols();
			validateBlocks();	
		};

		/*
		 *  Attach events to passed input node when constructing UI.
 		 */
		var attachEvents = function(input,gameObj,gameUIObj) {

			//Bind event for easy button.
			$("#easy").unbind();
			$("#easy").click(function() {
				gameUIObj.setDifficultyLevel(0);
				gameUIObj.restartGame(true);
			});

			//Bind event for easy button.
			$("#medium").unbind();
			$("#medium").click(function() {
				gameUIObj.setDifficultyLevel(1);
				gameUIObj.restartGame(true);
			});

			//Bind event for easy button.
			$("#hard").unbind();
			$("#hard").click(function() {
				gameUIObj.setDifficultyLevel(2);
				gameUIObj.restartGame(true);
			});

			//Bind event for Restart Game Button.
			$(".restart").unbind();
			$(".restart").click(function() {
				gameUIObj.restartGame(false);
			});

			//Bind event for New Game Button.
			$(".new").unbind();
			$(".new").click(function() {
				gameUIObj.restartGame(true);
			});

			//Bind event for New Game Button.
			$(".solve").unbind();
			$(".solve").click(function() {
				gameUIObj.solveGame(true);
			});

			//Bind event for Start/Pause Timer.
			$("#timerDiv").unbind();
			$("#timerDiv").click(function() {
				if (!_timerPausedFlag) {
					_timerPausedFlag = true;
					_timerObj.pauseTimer();
					$("#center").mask("Game Paused");
					
				} else {
					_timerPausedFlag = false;
					_timerObj.runTimer();
					$("#center").unmask();
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

			/*
			 * Attaching Key UP event.
			 * This is one of the key callback function.
			 * This function is called whenever user enters value in the node.
			 */
			input.keyup(function(){
				//Filter text entered using this jquery plugin.
				$(".numeric").numeric();
	    		var oldval = $(this).data("oldval");
	    		var val = $(this).val();
	    		val = parseInt(val,10);
	    		if (val < 1 || val > 9) {
	    			this.value = '';
	    			return;
	    		}
	    			
	    		var preval;
	    		var index = $(this).data("index");

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

	    		validateTableHighlightError();

	    		// Update all values with latest info.
	    		$(this).data("oldval",val);
	    		$(this).data("val",val);
	    		this.value = val;	
	    	});
		};

		var highlightDifficultyLevel = function(_difficultyLevel) {
			if (_difficultyLevel == 0) {
				$('#medium').removeClass('buttons_hover');
				$('#hard').removeClass('buttons_hover');
				$('#easy').addClass('buttons_hover');

			} else if (_difficultyLevel == 1) {
				$('#easy').removeClass('buttons_hover');
				$('#hard').removeClass('buttons_hover');
				$('#medium').addClass('buttons_hover');
			} else if (_difficultyLevel == 2) {
				$('#easy').removeClass('buttons_hover');
				$('#medium').removeClass('buttons_hover');
				$('#hard').addClass('buttons_hover');
			}

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

		/*
		 *  Public function to restart Game.
		 *  isNew: True for new game, False for restarting current game.
 		 */
		this.restartGame = function(isNew) {
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
			$('#center').append(_gameUI.constructBoardUI(isNew));
		};

		/*
		 *  Public function to restart Game.
		 *  isNew: True for new game, False for restarting current game.
 		 */
		this.solveGame = function(isNew) {
			var solvedMatrix = _gameObj.getSolvedMatrix();
			var table = $('#sudokuTable')[0];
			for(var row = 0; row<9; row++) {
			    for (var col = 0; col<9; col++) {
			    	input = getInputNodeFromTable(row,col);
			    	input.prop('disabled', true);
			    	input.val(solvedMatrix[row][col]);
			    	input.removeClass("error-bg-color");
			    }
			}
			_timerObj.stopTimer();
		}

		this.setDifficultyLevel = function(difficultyLevel) {
			_difficultyLevel = difficultyLevel;
		}

		/*
		 *  Public Function exposed to construct Sudoku Board UI with data.
		 *  Returns TABLE DOM that will get added inside center container div.
 		 */
		this.constructBoardUI = function(isNew) {
			var gameObj = this.getGameUIInstance();
			if (isNew) {
				gameObj.setDifficultyLevel(_difficultyLevel);
				_currentSudokuMatrix = gameObj.createBoardMatrix();
			} else {
				if (!_currentSudokuMatrix)
					return false;
			}

			highlightDifficultyLevel(_difficultyLevel);

			var data, input, td, blocki, blockj;

			var table = $('<table id="sudokuTable"></table>').addClass("fit");

			//Create tr's, td's for table.
			for(var i=0; i<9; i++) {
			    var rowTr = $('<tr></tr>');

			    for (var j=0; j<9; j++) {
			    	data = _currentSudokuMatrix[i][j];
			    	input = $('<input class="numeric" type="text"/>').attr({
			    		'maxlength': "2",
			    		'min': '1',
			    		'max': '9'});

			    	if (data >= 0 	 && data <=9) {
			    		input.attr({
			    			'value' : data,
			    			'disabled': true,
			    		}).addClass("disabled-content").data("can-edit",false);
			    	} else if (data == -1) {
			    		input.data("can-edit", true);	
			    	}

			    	input.data("index", {row:i, col:j});
			    	input.data("error-counter",0);

			    	//Attach events to the input node.
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
/*
 *	Sudoku Class.
 *  Singleton.
 *  @author santhoshkumar soundararajan
 */
var Sudoku = (function($) {
	var _instance;
	var _gameUI;

	function init() {
		_gameUI = new SudokuGameUI();
		return {
			getBoard: function() {
				return _gameUI.constructBoardUI();
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
		 *	Sudoku Game Class.
		 *  Has all game logic like GenerateBoard, Solve, Validate etc.
		 */
		function Game() {
			//Game Properties
			var _sudokuMatrix;
		}

		Game.prototype = {
			generateBoardMatrix: function() {
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
			}
		};

		this.getGameInstance = function() {
			if (!_gameObj) {
				_gameObj = new Game();
				return _gameObj;
			} else
				return _gameObj; 
		};
	}

	SudokuGameUI.prototype = {
		constructBoardUI: function() {
			var gameObj = this.getGameInstance();

			var cellData = gameObj.generateBoardMatrix();

			var table = $('<table></table>').addClass("fit");
			for(var i=0; i<9; i++){
			    var row = $('<tr></tr>');
			    for (var j=0; j<9; j++) {
			    	var data = cellData[i][j];
			    	var input = $('<input type="text"/>').attr({
			    		'maxlength': "2",
			    		'min': '1',
			    		'max': '9'});

			    	if (data >= 1 && data <=9) {
			    		input.attr({
			    			'value' : data,
			    			'disabled': true
			    		});
			    	}

			    	input.keyup(function(){
			    		var val = $(this).val();
			    		var preval;

			    		if (val.length == 2) {
			    			preval = val[0];
			    			val = val[1];
			    		} 

			    		if (!$.isNumeric(val) || val == 0) {
			    			val = '';
			    		}

			    		if (preval && val == '')
			    			this.value = preval;
			    		else 
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
			    	row.append(td.append(input));
			    }
			    table.append(row);
			}
			return table;
		}
	};

	return {
		getInstance: function () {
			if (!_instance) {
	    	    _instance = init();
	    	}
    		return _instance;
		}
	}

}) (jQuery);
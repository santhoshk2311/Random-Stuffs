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
		// properties  
	}

	SudokuGameUI.prototype = {
		constructBoardUI: function() {
			var table = $('<table></table>').addClass("fit");
			for(var i=0; i<9; i++){
			    var row = $('<tr></tr>');
			    for (var j=0; j<9; j++) {
			    	var input = $('<input type="text"/>').attr({
			    		'maxlength': "1",
			    		'min': '1',
			    		'max': '9'});

			    	input.keyup(function(){
			    		var val = $(this).val();
			    		if (!$.isNumeric(val) || val == 0) {
			    			this.value = '';
			    			return false;
			    		}

			    		if (val.length > 1) {
			    			this.value = val.substring(0,1);
			    			console.log(val.substring(0,1));
			    			return false;
			    		}
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
			    //console.log(row);
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
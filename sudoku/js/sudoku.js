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
			    	row.append($('<td>').html(j));
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
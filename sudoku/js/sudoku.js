var Sudoku = (function($) {
	var instance;

	function init() {
		return "game";
	}

	return {
		getInstance: function () {
			if ( !instance ) {
	    	    instance = init();
	    	}
    		return instance;
		}
	}
}) (jQuery);
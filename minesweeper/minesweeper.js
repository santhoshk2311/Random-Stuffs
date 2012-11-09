var game,grid;
var noOfRows,noOfRows,noOfRows;

function createGrid(rowMax, colMax) {
	var grid = [];
	
	for (var row=0;row<rowMax; row++) {
		grid[row] = [];
		for (var col=0;col<colMax; col++) {
			grid[row][col] = 0;
		}
	}
	return grid;
}

function placeMines(grid,rowMax,colMax,mineCount) {
	var x,y,currX,currY;
	for (var i=0;i<mineCount;i++) {
		while(true) {
			currX = Math.floor(Math.random() *  (rowMax));
			currY = Math.floor(Math.random() *  (colMax));			
		
			if (grid[currX][currY] == 0)
				break;
		}
			
		for (x=-1;x<2;x++) {
			for (y=-1;y<2;y++) {
				if (x==0 && y==0) {
					grid[currX][currY] = -1;
				} else if (currX+x>=0 && currX+x<rowMax && currY+y >=0 && currY+y<colMax) {
					grid[currX+x][currY+y]++;
				}
			}
		}
	}
	return grid;
}

function Game(noOfRows, noOfCols, mineCount) {
    grid = createGrid(noOfRows,noOfCols);
	placeMines(grid,noOfRows,noOfCols,mineCount);
	$('#board').empty();
	createDynamicTable($('#board'), noOfRows, noOfCols);
	
	function isMine($el) {
		return (($el.text()) == "*");
	}

	function isEmpty($el) {
		return ((+($el.text())) == 0);
	}

	function isWinning() {
		return ($('.notchecked').length == mineCount); 
	}
	
	var showNeighbourCount=0;
	function checkNeighbours($el,grid,openCell) {
		if (!isEmpty($el)) 
			return;
		
		var rowCol = $el.attr('id');
		var rowColSplit = rowCol.split("_");
		var r = +(rowColSplit[0]),c = +(rowColSplit[1]);
		
		var _d = function($e) {
			showNeighbourCount++;
			return function() {
				checkNeighbours($e,$('#board'),openCell);
				if (--showNeighbourCount)
					openCell();
			}
		};
		
		for (x=-1;x<2;x++) {
			for (y=-1;y<2;y++) {
				var $currEl = $('#' + (x+r) + '_' + (y+c));
				if ((r+x>=0 && r+x<noOfRows && c+y >=0 && c+y<noOfCols)
					&& $currEl.hasClass('notchecked') && !isMine($currEl)) {
						//checkNeighbours($currEl,$('#board'));
						setTimeout(_d($currEl.removeClass('notchecked')), 50);
				}
			}
		}
	}
	
	function endGame() {		
		$('.notchecked').text('');
		$('.mine').text('*');
		$('.notchecked').removeClass('notchecked');		
		$("#board").unbind('click');
		$("#validate_game").attr("disabled", "disabled");
		$("#cheat_game").attr("disabled", "disabled");		
	}
	
	function doWin() {		
		endGame();
		alert("Congratulations... You Won!!! Click 'New Game' to play again...");
	}
	
	function doFail() {
		endGame();
		alert("You Lost!!! Click 'New Game' to play again...");
	}
	
	$("#board").mousedown(function(e) {
		switch(e.which) {
			case 3:
				var $tdElement = $(e.target).closest('td');				
				if ($tdElement.hasClass('notchecked')) {
					$tdElement.text('');
					var $imgTag = $("<img>")
									.attr('src','images/redflag.gif')
									.attr('height','10px')
									.attr('width','10px');
					$imgTag.bind('contextmenu', function(e) {
						return false;
					}); 
					$imgTag.appendTo($tdElement);
					$tdElement.removeClass('notchecked');
					$tdElement.addClass('redflag');
				} else {
					$tdElement.bind('contextmenu', function(e) {
						return false;
					});
					$tdElement.empty();
					$tdElement.removeClass('redflag');
					$tdElement.addClass('notchecked');					
					var rowCol = $tdElement.attr('id');
					var rowColSplit = rowCol.split("_");
					var r = +(rowColSplit[0]),c = +(rowColSplit[1]);
					$tdElement.text(grid[r][c]);
				}
			break;	
		}
	});
	
	$("#board").click(function(e) {
		var $tdElement = $(e.target).closest('td');
		if ($tdElement.length == 0)
			return;
		var openCell = function () {
			$tdElement.removeClass("notchecked");
			if (isWinning()) 
				doWin();
		};
		
		if (isMine($tdElement))
			doFail();
		else {
			if (isEmpty($tdElement)) {
				checkNeighbours($tdElement,$("#board"),openCell);
			} else {
				openCell();				
			}
		}	
	});
	
	// public functions
	this.isActive = function() { 
		return (($('.notchecked').length != 0) && ($('.notchecked').length != (noOfRows*noOfCols)) );
	}; 
	this.doWin = doWin;
	this.doFail = doFail;
}

function createDynamicTable(tbody, rows, cols) {
	if (tbody == null || tbody.length < 1) 
		return;  
	for (var r = 0; r < rows; r++) {  
		var trow = $("<tr>");  
		for (var c = 0; c < cols; c++) {               
			var $el = $("<td>")
					.addClass("tableCell")
					.appendTo(trow)
					.attr('height','10px')
					.attr('width','10px')
					.attr('id',r + '_' + c);
					
			if (grid[r][c] == -1) {
				$el.addClass('mine');
				$el.text('*');
			} else 
				$el.text(grid[r][c]);
			$el.addClass("notchecked");
		}  
		trow.appendTo(tbody);  
	}
}

function startNewGame() {
	var difficultyLevel = $("input[@name=difficulty]:checked").val();
	if (difficultyLevel == "easy") {
		noOfRows = 8;
		noOfCols = 8;
		noOfMines = 10;
	} else if (difficultyLevel == "medium") {
		noOfRows = 16;
		noOfCols = 16;
		noOfMines = 30;
	} else if (difficultyLevel == "hard") {
		noOfRows = 32;
		noOfCols = 32;
		noOfMines = 60;
	}	
	//createDynamicTable($("#board"), noOfRows, noOfCols);	
	game = new Game(+(noOfRows), +(noOfCols), +(noOfMines));
	$("#validate_game").removeAttr("disabled");
	$("#cheat_game").removeAttr("disabled");
}

$('#new_game').click(function() {
	if (!game.isActive() || confirm("Are you sure you want to restart the game?")) {	
		startNewGame();		
	}
});

$('#validate_game').click(function() {
	var redFlagTiles = $('.notchecked');
	var isLost = false;
	$.each(redFlagTiles, function() {
		var jQueryTdObj = $(this);
		if (jQueryTdObj.text() != '*') {
			game.doFail();
			isLost = true;
			return false;
		}
	});
	if (!isLost)
		game.doWin();
	
});

function toggleCellClass(el) {
	el.each(function() {
		$(this).toggleClass("notchecked");
	});
}

$('#cheat_game').click(function() {
	setTimeout(function() { toggleCellClass($('.mine'));},100);	
	toggleCellClass($('.mine'));
});

$(document).ready(function(){
	startNewGame();
});
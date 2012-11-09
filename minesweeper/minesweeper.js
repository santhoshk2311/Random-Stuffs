var game,grid;
var noOfRows,noOfRows,noOfRows,difficultyLevel,openedCellsPosAr;

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

function Game(noOfRows, noOfCols, mineCount,isLoadingGame) {
	isLoadingGame = typeof isLoadingGame !== 'undefined' ? isLoadingGame : false;
	
	if (!isLoadingGame) {
		openedCellsPosAr = [];
		grid = createGrid(noOfRows,noOfCols);
		placeMines(grid,noOfRows,noOfCols,mineCount);
	}	
	
	$('#board').empty();
	createDynamicTable($('#board'), noOfRows, noOfCols);
	
	if (isLoadingGame) {
		openCells();
	}
	
	function openCells() {
		for (var i=0;i<openedCellsPosAr.length;i++) {
			$('#' + openedCellsPosAr[i]).removeClass('notchecked');
		}
	}
	
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
				if (--showNeighbourCount) {
					var rowColPos = $e.attr('id');
					if (jQuery.inArray(rowColPos, openedCellsPosAr) == -1)
							openedCellsPosAr.push(rowColPos);						
					openCell();
				}
			}
		};
		
		for (x=-1;x<2;x++) {
			for (y=-1;y<2;y++) {
				var $currEl = $('#' + (x+r) + '_' + (y+c));
				if ((r+x>=0 && r+x<noOfRows && c+y >=0 && c+y<noOfCols)
					&& $currEl.hasClass('notchecked') && !isMine($currEl)) {
						//checkNeighbours($currEl,$('#board'));	
						var rowColPos = $currEl.attr('id');
						if (jQuery.inArray(rowColPos, openedCellsPosAr) == -1)
							openedCellsPosAr.push(rowColPos);						
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
		$("#save_game").attr("disabled", "disabled");
		$("#clear_game").attr("disabled", "disabled");
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
	$("#board").unbind();
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
				var rowColPos = $tdElement.attr('id');
				if (jQuery.inArray(rowColPos, openedCellsPosAr) == -1)
					openedCellsPosAr.push(rowColPos);
				openCell();				
			}
		}	
	});
	
	function saveGame() {
		var gridJson = JSON.stringify(grid);
		var openedCellsPosJson = JSON.stringify(openedCellsPosAr);
		$.jStorage.set("grid", gridJson);
		$.jStorage.set("openCells", openedCellsPosJson);
		$.jStorage.set("difficultyLevel", difficultyLevel);		
		alert("Saved Game!!!");
	}
	
	// public functions
	this.isActive = function() { 
		return (($('.notchecked').length != 0) && ($('.notchecked').length != (noOfRows*noOfCols)) );
	}; 
	this.doWin = doWin;
	this.doFail = doFail;
	this.saveGame = saveGame;
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

function setRowsColsMines(difficultyLevel) {
	if (difficultyLevel == "easy") {
		noOfRows = 8;
		noOfCols = 8;
		noOfMines = 10;
	} else if (difficultyLevel == "medium") {
		noOfRows = 16;
		noOfCols = 16;
		noOfMines = 40;
	} else if (difficultyLevel == "hard") {
		noOfRows = 32;
		noOfCols = 32;
		noOfMines = 150;
	}
}

function enableButtons() {
	$("#validate_game").removeAttr("disabled");	
	$("#cheat_game").removeAttr("disabled");	
	$("#save_game").removeAttr("disabled");
	if (isLoadGameAvailable()) {
		$("#clear_game").removeAttr("disabled");
		$("#load_game").removeAttr("disabled");
	}
}

function startNewGame() {
	difficultyLevel = $("input[@name=difficulty]:checked").val();
	setRowsColsMines(difficultyLevel);		
	//createDynamicTable($("#board"), noOfRows, noOfCols);	
	game = new Game(+(noOfRows), +(noOfCols), +(noOfMines));
	enableButtons();	
}

function isLoadGameAvailable() {
	//Local variables, just for testing load game availability.
	var grid,difficultyLevel,openedCellsPosAr;
	grid = JSON.parse($.jStorage.get("grid"));		
	difficultyLevel = $.jStorage.get("difficultyLevel");
	openedCellsPosAr = JSON.parse($.jStorage.get("openCells"));
	if (grid != null && difficultyLevel != null && openedCellsPosAr != null) 
		return true;
	else 
		return false;	
}

function loadGame() {
	if (isLoadGameAvailable()) {
		grid = JSON.parse($.jStorage.get("grid"));		
		difficultyLevel = $.jStorage.get("difficultyLevel");
		openedCellsPosAr = JSON.parse($.jStorage.get("openCells"));
		if (typeof game == 'undefined' || confirm("Are you sure you want to load last saved game?")) {	
			if (typeof game == 'undefined' && confirm("There is already a game saved. Do you want to load already saved game? Cancel will load a new game.")) {				
					setRowsColsMines(difficultyLevel);
					game = new Game(+(noOfRows), +(noOfCols), +(noOfMines),true);
			} else {
				if (typeof game != 'undefined') {
					setRowsColsMines(difficultyLevel);
					game = new Game(+(noOfRows), +(noOfCols), +(noOfMines),true);					
				} else {
					startNewGame();
				}
			}			
			enableButtons();
		} else {
			startNewGame();
		}
		return true;
	} else {
		$("#clear_game").attr("disabled", "disabled");
		return false;
	}
}

function clearGame() {
	if (isLoadGameAvailable() && confirm("Are you sure you want to clear the last saved game?")) {
		$.jStorage.flush();
		$("#clear_game").attr("disabled", "disabled");
		$("#load_game").attr("disabled", "disabled");
	}
}


function toggleCellClass(el) {
	el.each(function() {
		$(this).toggleClass("notchecked");
	});
}

$('#new_game').click(function() {
	if ((typeof game != 'undefined' && game.isActive())) {
		if (confirm("Are you sure you want to restart the game?"))
			startNewGame();		
	} else {
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


$('#cheat_game').click(function() {
	setTimeout(function() { toggleCellClass($('.mine'));},100);	
	toggleCellClass($('.mine'));
	
});

$('#save_game').click(function() {
	game.saveGame();
	$("#load_game").removeAttr("disabled");
	$("#clear_game").removeAttr("disabled");
});

$('#load_game').click(function() {
	loadGame();
});

$('#clear_game').click(function() {
	clearGame();
});

$(document).ready(function(){
	if (!loadGame()) {
		startNewGame();
		$("#load_game").attr("disabled", "disabled");
		$("#clear_game").attr("disabled", "disabled");
	} 
});
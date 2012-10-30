function placeTokenInBoard(board,row,col,player,tdElement) {
	if (player) {
		// Player 1
		board[row][col] = 1;
		$(tdElement).addClass("redbg");
	} else {
		// Player 2
		board[row][col] = 2;
		$(tdElement).addClass("bluebg");
	}
}

function createDynamicTable(tbody, rows, cols) {
	if (tbody == null || tbody.length < 1) 
		return;  
	for (var r = 0; r < rows; r++) {  
		var trow = $("<tr>");  
		for (var c = 0; c < cols; c++) {               
			$("<td>")
					.addClass("tableCell")
					.appendTo(trow)
					.attr('height','30px')
					.attr('height','30px')
					.attr('id',r + '_' + c);
		}  
		trow.appendTo(tbody);  
	}
}

function isVictory(board, currentRow, currentCol) {
//function isVictory(pieces, placedX, placedY) {
	var isWin=false,minX,maxX,minY,maxY;
	var i, j, x, y, maxX, maxY, steps, count = 0,
		directions = [
		{ x: 0, y: 1  }, // North-South
		{ x: 1, y: 0  }, // East-West
		{ x: 1, y: 1  }, // Northeast-Southwest
		{ x: 1, y: -1 }  // Southeast-Northwest
	];
	
	//Check top-down direction for winning criteria.
	if (currentRow > 3)
		minX = currentRow - 3;
	else 
		minX = 0;
		
	if (currentRow < 2) 
		maxX = currentRow + 3;
	else
		maxX = 5;
	
	if (currentRow < 3) 
		steps = currentRow + 1;
	else
		steps = maxX - currentRow + 1;
	
	outerloop_top:
	for (j=0;j<steps;j++,count=0) {
	     for (k=minX+j;k<minX+j+4;k++) {
			if (board[k][currentCol] == board[currentRow][currentCol]) {
			    count++;
				if (count == 4) {
					break outerloop_top;
				}
			}
		 }
	}
	
	if (count == 4)
		return true;
	
	//Check left-right direction for winning criteria.
	count=0;
	if (currentCol > 3)
		minY = currentCol - 3;
	else 
		minY = 0;
		
	if (currentCol < 3)
		maxY = currentCol + 3;
	else 
		maxY = 6;
		
	if (currentCol < 4) 
		steps = currentCol + 1;
	else
		steps = maxY - currentCol + 1;
		
	outerloop_left:
	for (j=0;j<steps;j++,count=0) {
	     for (k=minY+j;k<minY+j+4;k++) {
			if (board[currentRow][k] == board[currentRow][currentCol]) {
			    count++;
				if (count == 4) {
					break outerloop_left;
				}
			}
		}
	}
	
	if (count == 4)
		return true;
		
	//Check top-left to bottom-right direction for winning criteria.
	count=0;	
	minX = Math.max(Math.max(currentRow - 3,0),currentRow-currentCol);
	minY = Math.max(Math.max(currentCol - 3,0),currentCol-currentRow);
	maxX = Math.min((currentRow+(board[0].length-1)-currentCol),Math.min(currentRow + 3, board.length-1));
	maxY = Math.min((currentCol+(board.length-1)-currentRow),Math.min(currentCol + 3, board[0].length-1));
		
	lengthDiagnol = maxX - minX + 1;
	if (lengthDiagnol > 3) {
		pointsLeft = currentRow - minX;
		pointsRight = maxX - currentRow;
		steps = 0;
		var leftPointsNeeded,rightPointsNeeded;
		for (var i=1;i<=4;i++) {
			leftPointsNeeded = i-1;
			rightPointsNeeded = 4-i;
			if (leftPointsNeeded <= pointsLeft && rightPointsNeeded <= pointsRight)
				steps++;
		}		
		outerloop_top_left:
		for (j=0;j<steps;j++,count=0) {
			 for (x=minX+j,y=minY+j;(x<minX+j+4 && y<minY+j+4);x++,y++) {
				if (board[x][y] == board[currentRow][currentCol]) {
					count++;
					if (count == 4) {
						break outerloop_top_left;
					}
				}
			}
		}
	}
	
	if (count == 4)
		return true;
	
	//Check bottom-left to top-right direction for winning criteria.
	count=0;	
	minX = Math.max(Math.max(currentRow - 3,0),currentRow-((board[0].length-1)-currentCol));
	minY = Math.max(Math.max(currentCol - 3,0),currentCol-((board.length-1)-currentRow));
	maxX = Math.min((currentRow+(currentCol-0)),Math.min(currentRow + 3, board.length-1));
	maxY = Math.min((currentCol+(currentRow-0)),Math.min(currentCol + 3, board[0].length-1));
	
	lengthDiagnol = maxX - minX + 1;
	if (lengthDiagnol > 3) {
		pointsLeft = currentRow - minX;
		pointsRight = maxX - currentRow;
		steps = 0;
		var leftPointsNeeded,rightPointsNeeded;
		for (var i=1;i<=4;i++) {
			leftPointsNeeded = i-1;
			rightPointsNeeded = 4-i;
			if (leftPointsNeeded <= pointsLeft && rightPointsNeeded <= pointsRight)
				steps++;
		}		
		outerloop_bottom_left:
		for (j=0;j<steps;j++,count=0) {
			 for (x=minX+j,y=maxY-j;(x<minX+j+4 && y>=minY);x++,y--) {
				if (board[x][y] == board[currentRow][currentCol]) {
					count++;
					if (count == 4) {
						break outerloop_bottom_left;
					}
				}
			}
		}
	}
		
	if (count == 4)
		return true;	
		
	return false;
}
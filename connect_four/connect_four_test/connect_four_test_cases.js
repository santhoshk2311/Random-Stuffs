// Test Case #1
function runTestVerticalPattern() {
	var board = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	];
	
	
	if ($("#board").length)
		$("#board").children().remove();

	createDynamicTable($("#board"), 6, 7);
	placeTokenInBoard(board,5,2,true,$("#5_2"));
	placeTokenInBoard(board,5,0,false,$("#5_0"));
	placeTokenInBoard(board,4,2,true,$("#4_2"));
	placeTokenInBoard(board,4,0,false,$("#4_0"));
	placeTokenInBoard(board,3,2,true,$("#3_2"));
	placeTokenInBoard(board,3,0,false,$("#3_0"));
	placeTokenInBoard(board,2,2,true,$("#2_2"));

	if (isVictory(board,2,2)) {
		alert("Verified vertical pattern...");
	}
}

// Test Case #2
function runTestHorizontalPattern() {
	var board = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	];

	if ($("#board").length)
		$("#board").children().remove();
		
	createDynamicTable($("#board"), 6, 7);
	placeTokenInBoard(board,5,1,true,$("#5_1"));
	placeTokenInBoard(board,5,6,false,$("#5_6"));
	placeTokenInBoard(board,5,2,true,$("#5_2"));
	placeTokenInBoard(board,4,6,false,$("#4_6"));
	placeTokenInBoard(board,5,3,true,$("#5_3"));
	placeTokenInBoard(board,3,6,false,$("#3_6"));
	placeTokenInBoard(board,5,4,true,$("#5_4"));

	if (isVictory(board,5,4)) {
		alert("Verified horizontal pattern..");
	}
}

// Test Case #3
function runTestRightDiagnalPattern() {
	var board = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	];

	if ($("#board").length)
		$("#board").children().remove();
	
	createDynamicTable($("#board"), 6, 7);
	placeTokenInBoard(board,5,0,true,$("#5_0"));
	placeTokenInBoard(board,5,6,false,$("#5_6"));
	placeTokenInBoard(board,5,5,true,$("#5_5"));
	placeTokenInBoard(board,4,5,false,$("#4_5"));
	placeTokenInBoard(board,5,4,true,$("#5_4"));
	placeTokenInBoard(board,4,4,false,$("#4_4"));
	placeTokenInBoard(board,5,3,true,$("#5_3"));
	placeTokenInBoard(board,3,4,false,$("#3_4"));
	placeTokenInBoard(board,5,1,true,$("#5_1"));
	placeTokenInBoard(board,5,2,false,$("#5_2"));
	placeTokenInBoard(board,4,3,true,$("#4_3"));
	placeTokenInBoard(board,4,6,false,$("#4_6"));
	placeTokenInBoard(board,3,3,true,$("#3_3"));
	placeTokenInBoard(board,2,3,false,$("#2_3"));
	
	if (isVictory(board,2,3)) {
		alert("Verified right diagnal pattern..");
	}	
}

// Test Case #4
function runTestLeftDiagnalPattern() {
	var board = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	];

	if ($("#board").length)
		$("#board").children().remove();
	
	createDynamicTable($("#board"), 6, 7);
	placeTokenInBoard(board,5,0,true,$("#5_0"));
	placeTokenInBoard(board,5,1,false,$("#5_1"));
	placeTokenInBoard(board,4,1,true,$("#4_1"));
	placeTokenInBoard(board,5,2,false,$("#5_2"));
	placeTokenInBoard(board,4,2,true,$("#4_2"));
	placeTokenInBoard(board,5,5,false,$("#5_5"));
	placeTokenInBoard(board,3,2,true,$("#3_2"));
	placeTokenInBoard(board,5,3,false,$("#5_3"));
	placeTokenInBoard(board,5,4,true,$("#5_4"));
	placeTokenInBoard(board,4,3,false,$("#4_3"));
	placeTokenInBoard(board,3,3,true,$("#3_3"));
	placeTokenInBoard(board,4,4,false,$("#4_4"));
	placeTokenInBoard(board,2,3,true,$("#2_3"));
	
	
	if (isVictory(board,2,3)) {
		alert("Verified left diagnal pattern..");
	}	
}




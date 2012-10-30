/* Given a string of space-separated fruit names, such as:

var text = "Apple PEAR banana pineapple appLE';

Write a function in javascript that outputs the starting index of each occurrence of the word "apple" in the string (case insensitive).

For example, for the text string above, the output should be 0, 28. */

function findIndexes(text, string) {
    for(var i=0;i<text.length;) {
		var word="";
		var j=i;
		while(text[j]!= " " && j < text.length) { 
			word += text[j].toLowerCase();			
			j++;
		}
		if (word == "apple")
			console.log(i);
		if (i==j)
			i++;
		else
			i=j+1;
	}
}

//Sample Input
var text = "Apple PEAR banana pineapple appLE";

findIndexes (text,"apple");
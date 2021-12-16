/**
 * File: hw5.js
 * GUI Assignment: Implementing a Bit of Scrabble with Drag-and-Drop
 *
 * - This assignment uses HTML, CSS, and JavaScript to create a simplified,
 *   one-lined version of Scrabble including implementation of dragging
 *   and dropping tiles via mouse click and drag by user
 *
 * - This file contains the JavaScript for the entire project, generating the
 *   board, tiles, updating the score based off of correct user word creation,
 *   and error messages based off of incorrect user word creation
 *
 * Jacob Leboeuf, UMass Lowell Computer Science, jacob_leboeuf@student.uml.edu,
 * Copyright (c) 2021 by Jacob. All rights reserved. May be freely copied or
 * excerpted for educational purposes with credit to the author.
 * updated by JL on December 16, 2021 at 5:01 AM
**/

// GLOBAL VARIABLES
var board = [
    {"id": "drop0",  "tile": "pieceX"},
    {"id": "drop1",  "tile": "pieceX"},
    {"id": "drop2",  "tile": "pieceX"},
    {"id": "drop3",  "tile": "pieceX"},
    {"id": "drop4",  "tile": "pieceX"},
    {"id": "drop5",  "tile": "pieceX"},
    {"id": "drop6",  "tile": "pieceX"},
    {"id": "drop7",  "tile": "pieceX"},
    {"id": "drop8",  "tile": "pieceX"},
    {"id": "drop9",  "tile": "pieceX"},
    {"id": "drop10", "tile": "pieceX"},
    {"id": "drop11", "tile": "pieceX"},
    {"id": "drop12", "tile": "pieceX"},
    {"id": "drop13", "tile": "pieceX"},
    {"id": "drop14", "tile": "pieceX"}
];
var tiles = [
    {"id": "piece0", "letter": "A"},
    {"id": "piece1", "letter": "B"},
    {"id": "piece2", "letter": "C"},
    {"id": "piece3", "letter": "D"},
    {"id": "piece4", "letter": "E"},
    {"id": "piece5", "letter": "F"},
    {"id": "piece6", "letter": "G"}
];
var pieces = [
    {"letter":"A", "value":1,  "amount":9},
    {"letter":"B", "value":3,  "amount":2},
    {"letter":"C", "value":3,  "amount":2},
    {"letter":"D", "value":2,  "amount":4},
    {"letter":"E", "value":1,  "amount":12},
    {"letter":"F", "value":4,  "amount":2},
    {"letter":"G", "value":2,  "amount":3},
    {"letter":"H", "value":4,  "amount":2},
    {"letter":"I", "value":1,  "amount":9},
    {"letter":"J", "value":8,  "amount":1},
    {"letter":"K", "value":5,  "amount":1},
    {"letter":"L", "value":1,  "amount":4},
    {"letter":"M", "value":3,  "amount":2},
    {"letter":"N", "value":1,  "amount":6},
    {"letter":"O", "value":1,  "amount":8},
    {"letter":"P", "value":3,  "amount":2},
    {"letter":"Q", "value":10, "amount":1},
    {"letter":"R", "value":1,  "amount":6},
    {"letter":"S", "value":1,  "amount":4},
    {"letter":"T", "value":1,  "amount":6},
    {"letter":"U", "value":1,  "amount":4},
    {"letter":"V", "value":4,  "amount":2},
    {"letter":"W", "value":4,  "amount":2},
    {"letter":"X", "value":8,  "amount":1},
    {"letter":"Y", "value":4,  "amount":2},
    {"letter":"Z", "value":10, "amount":1},
    {"letter":"_", "value":0,  "amount":2}
];
var totalScore = 0;
var highScore = 0;
var currentScore = 0;

var dict = {};

// Do a jQuery Ajax request for the text dictionary
/*$.ajax({
  url: "dictionary.txt",
  success: function( txt ) {
      // Get an array of all the words
      var words = txt.split( "\n" );

      // And add them as properties to the dictionary lookup
      // This will allow for fast lookups later
      for ( var i = 0; i < words.length; i++ ) {
          dict[ words[i].toUpperCase() ] = true;
          console.log(words[i].toUpperCase());
      }
  }
});
*/

// Function creates word based off of tiles placed and generates score based off of letter amounts
// Updates potential score as well as notifies user if word is too small for validation
function makeWord() {
    var word = "";
    var score = 0;
    for (var i = 0; i < 15; i++) {
        if(board[i].tile != "pieceX") {
          word += getLetter(board[i].tile);
          score += makeScore(board[i].tile);
        }
    }
    score += (score * checkWordDouble());
    currentScore = score;
    if (currentScore > 0) {
        $("#score").html(totalScore + " + " + currentScore);
    }
    if(word !== "") {
        $("#word").html(word);
    if (word.length < 2) {
        $("#messages").html("Not enough tiles for a word!");
    } else {
        $("#messages").html("Ready to submit!");
    }
  }
}

// Determines whether tile is placed on Double Word space or not
// Helper function used in makeWord();
function checkWordDouble() {
    if(board[2].tile !== "pieceX") {
        return 1;
    }
    if(board[12].tile !== "pieceX") {
        return 1;
    }
    return 0;
}

// Determines the potential score of the created word
// Helper function in makeWord();
function makeScore(id) {
    var letter = getLetter(id);
    var score = 0;
    for (var i = 0; i < 27; i++) {
        var x = pieces[i];
        if (x.letter === letter) {
            score = x.value;
            // Doubles score if necessary
            score += (score * checkLetterDouble(id));
            return score;
        }
    }
    return -1;
}

// Determines whether tile is placed on Double Letter space or not
// Helper function used in makeScore();
function checkLetterDouble(id) {
    var dropID = getTilePosition(id);
    if (dropID === "drop6" || dropID === "drop8") {
        return 1;
    }
    return 0;
}

// Retrieves the position of the tile given the id provided
// Helper function used in checkLetterDouble();
function getTilePosition(id) {
    for (var i = 0; i < 15; i++){
        if (board[i].tile === id) {
            return board[i].id;
        }
    }
    return -1;
}

// Gets the letter value of the id provided
// Helper function used in makeWord(); and makeScore();
function getLetter(id) {
    for (var i = 0; i < 7; i++) {
        if (tiles[i].id === id) {
            return tiles[i].letter;
        }
    }
    return -1;
}

// Function creates new tiles while removing the ones it created from the data structure
// Helper function in boardClear();
function makeTiles() {
    var url = "images/Scrabble_Tile_";   // base URL of the image
    var randNum = 0;
    var piece = "";
    var pieceID = "";
    for (var i = 0; i < 7; i++) {
        var loop = true;
        while (loop === true){
            randNum = getRandomInt(0, 26);
            if (pieces[randNum].amount !== 0) {
                loop = false;
                pieces[randNum].amount--;
            }
        }
        piece = "<img class='pieces' id='piece" + i + "' src='" + url + pieces[randNum].letter + ".jpg" + "'></img>";
        pieceID = "#piece" + i;
        tiles[i].letter = pieces[randNum].letter;
        var pos = $("rackPic").position();
        var left = -165 + (50 * i);
        var top = -130;
        $("#rack").append(piece);
        $(pieceID).css("left", left).css("top", top).css("position", "relative");
        $(pieceID).draggable();
    }
}

// Helper function in makeTiles(); to generate a random number
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Makes pieces able to be dragged and dropped on board
// Executed as soon as page loads
function makeDroppable() {
    var url = "images/droppable.png";
    var drop = "<img class='droppable' id='drop" + i + "' src='" + url + "'></img>";
    var dropID = "#drop" + i;
    for (var i = 0; i < 15; i++) {
        drop = "<img class='droppable' id='drop" + i + "' src='" + url + "'></img>";
        dropID = "#drop" + i;
        var pos = $("#boardPic").position();
        var left = 0;
        var top = -125;
        $("#board").append(drop);
        $(dropID).css("left", left).css("top", top).css("position", "relative");
        $(dropID).droppable({
        // Heavy inspiration from
        // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
            drop: function(event, ui) {
                var dragID = ui.draggable.attr("id");
                var droppableID = $(this).attr("id");
                board[getBoardPosition(droppableID)].tile = dragID;
                makeWord();
            },
            out: function(event, ui) {
                var dragID = ui.draggable.attr("id");
                var droppableID = $(this).attr("id");
                if (dragID !== board[getBoardPosition(droppableID)].tile) {
                    return;
                }
                board[getBoardPosition(droppableID)].tile = "pieceX";
                makeWord();
            }
        });
    }
}

// Retrieves the position of the id provided on the board
// Helper function used in makeDroppable();
function getBoardPosition(id) {
    for (var i = 0; i < 15; i++){
        if (board[i].id === id) {
            return i;
        }
    }
    return -1;
}

// Destroys draggable quality of board pieces
// Then recreates board
// Called in validateWord(); and restartGame();
function boardClear() {
    for (var i = 0; i < 7; i++) {
        var id = '#' + tiles[i].id;
        $(id).draggable("destroy");
        $(id).remove();
    }
    board = [
        {"id": "drop0",  "tile": "pieceX"},
        {"id": "drop1",  "tile": "pieceX"},
        {"id": "drop2",  "tile": "pieceX"},
        {"id": "drop3",  "tile": "pieceX"},
        {"id": "drop4",  "tile": "pieceX"},
        {"id": "drop5",  "tile": "pieceX"},
        {"id": "drop6",  "tile": "pieceX"},
        {"id": "drop7",  "tile": "pieceX"},
        {"id": "drop8",  "tile": "pieceX"},
        {"id": "drop9",  "tile": "pieceX"},
        {"id": "drop10", "tile": "pieceX"},
        {"id": "drop11", "tile": "pieceX"},
        {"id": "drop12", "tile": "pieceX"},
        {"id": "drop13", "tile": "pieceX"},
        {"id": "drop14", "tile": "pieceX"}
    ];
    makeTiles();
    makeWord();
    $("#word").html("");
    $("#messages").html("Make a word with the tiles!");
}

// Clears the board and overall score attempt
// Excecuted with "Restart Game" button press
function restartGame() {
     boardClear();
     totalScore = 0;
     $("#score").html(totalScore);
     $("#messages").html("Board, tiles, and score cleared!");
}

// Checks if word consists of 2+ letters and updates score and board if so
// Was originally going to check dictionary but due to complications
// such extra credit attempt was scrapped
// Executed with "Submit Word" button click
function validateWord() {
    makeWord();
    var word = $("#word").html();
    if (word.length >= 2) { // only update score if word is 2+ letters
        totalScore += currentScore;
        if (totalScore > highScore) {
            highScore = totalScore;
            $("#highscore").html(highScore);
        }
    }
    $("#score").html(totalScore);
    if (word.length > 1) {
        boardClear();
    }
}

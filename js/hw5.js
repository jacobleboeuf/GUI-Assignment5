/**
 * File: hw4.js
 * GUI Assignment: Using the jQuery Plugin/UI with Your Dynamic Table
 *
 * - This assignment uses HTML, CSS, and JavaScript to create a Multiplication
 *   table based off of solely user input via a form, done so completely dynamically,
 *   and saves said tables into jQuery tabs, which can be selected and deleted respectively.
 *
 * - This file contains the JavaScript for the entire project, taking the
 *   inputted values by the user to create and display a Multiplication Table
 *   based on those values, or providing JQuery
 *
 * Jacob Leboeuf, UMass Lowell Computer Science, jacob_leboeuf@student.uml.edu,
 * Copyright (c) 2021 by Jacob. All rights reserved. May be freely copied or
 * excerpted for educational purposes with credit to the author.
 * updated by JL on November 15, 2021 at 2:01 PM
**/
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
  {"letter":"Blank", "value":0,  "amount":2}
];

//
var game_tiles = [
  {"id": "piece0", "letter": "A"},
  {"id": "piece1", "letter": "B"},
  {"id": "piece2", "letter": "C"},
  {"id": "piece3", "letter": "D"},
  {"id": "piece4", "letter": "E"},
  {"id": "piece5", "letter": "F"},
  {"id": "piece6", "letter": "G"}
];

var game_board = [
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

// dictionary related code used from Jason Downing's post on Piazza
// https://piazza.com/class/icm9jynacvn5kx?cid=43
var dict = {};

// Do a jQuery Ajax request for the text dictionary
$.ajax({
  url: "dictionary.txt",
  success: function( txt ) {
      // Get an array of all the words
      var words = txt.split( "\n" );

      // And add them as properties to the dictionary lookup
      // This will allow for fast lookups later
      for ( var i = 0; i < words.length; i++ ) {
          dict[ words[i].toUpperCase() ] = true;
      }
  }
});



function find_word() {
  var word = "";
  var score = 0;

  // Iterate through the board and generate a possible word.
  for(var i = 0; i < 15; i++) {
    console.log(game_board[i].tile);
    if(game_board[i].tile != "pieceX") {
      word += find_letter(game_board[i].tile);
      score += find_score(game_board[i].tile);
    }
  }

  // Factor in the doubling of certain tiles. Since the should_double() function returns 0 or 1,
  // this is easy to account for. If it's 0, 0 is added to the score. If it's 1, the score is doubled.
  score += (score * should_double());

  $("#score").html(score);

  if(word !== "") {
    $("#word").html(word);
    return;
  }

  $("#word").html("____");
}

//determines score doubling
function should_double() {
  if(game_board[2].tile !== "pieceX") {
    return 1;
  }
  if(game_board[12].tile !== "pieceX") {
    return 1;
  }
  return 0;
}

function find_score(given_id) {
  var letter = find_letter(given_id);
  var score = 0;

  // find the letter JSON object in the array
  for(var i = 0; i < 27; i++) {
    // Get an object to look at.
    var obj = pieces[i];

    // check if object is correct
    if(obj.letter === letter) {
      score = obj.value;

      // check if scores should be doubled
      score += (score * should_double_letter(given_id));

      return score;
    }
  }
  return -1;
}

function should_double_letter(given_id) {
  var dropID = find_tile_pos(given_id);

  // check if drop zone is a double score zone
  if(dropID === "drop6" || dropID === "drop8") {
    // yes
    return 1;
  }
  // no
  return 0;
}

function find_letter(given_id) {
  // iterate the 7 tiles
  for(var i = 0; i < 7; i++) {
    if(game_tiles[i].id === given_id) {
      // found letter
      return game_tiles[i].letter;
    }
  }
  // letter was not found
  return -1;
}

function find_board_pos(given_id) {
  for(var i = 0; i < 15; i++){
    if(game_board[i].id === given_id) {
      return i;
    }
  }
  return -1;
}

function find_tile_pos(given_id) {
  for(var i = 0; i < 15; i++){
    if(game_board[i].tile === given_id) {
      return game_board[i].id;
    }
  }
  return -1;
}

function load_scrabble_pieces() {
  console.log("load pieces entered");
  var base_url = "images/Scrabble_Tile_";   // base URL of the image
  var random_num = 1;
  var piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + random_num + ".jpg" + "'></img>";
  var piece_ID = "";
  var what_piece = "";

  // Load up 7 pieces
  for(var i = 0; i < 7; i++) {
    // Generate random tile but also check for overuse of a certain tile
    var loop = true;
    while(loop === true){
      random_num = getRandomInt(0, 26);

      // Remove words from the pieces data structure.
      if(pieces[random_num].amount !== 0) {
        loop = false;
        pieces[random_num].amount--;
      }
    }

    piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + pieces[random_num].letter + ".jpg" + "'></img>";
    //console.log(piece);
    piece_ID = "#piece" + i;
    game_tiles[i].letter = pieces[random_num].letter;

    // Reposition the tile on top of the rack
    // Get rack location
    var pos = $("#the_rack").position();

    // Now figure out where to reposition the board piece.
    var img_left = -165 + (50 * i);
    var img_top = -130;

    // Add the piece to the screen
    $("#rack").append(piece);

    // Move the piece relative to where the rack is located on the screen.
    $(piece_ID).css("left", img_left).css("top", img_top).css("position", "relative");

    // Make the piece draggable.
    $(piece_ID).draggable();
  }
}

function load_droppable_targets() {
  var img_url = "images/drop.png";   // URL of the image
  var drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
  var drop_ID = "#drop" + i;

  for(var i = 0; i < 15; i++) {
    drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
    drop_ID = "#drop" + i;

    // Get board location.
    var pos = $("#the_board").position();

    var img_left = 0;
    var img_top = -125;

    // Add the img to the screen.
    $("#board").append(drop);

    // Reposition the img relative to the board.
    $(drop_ID).css("left", img_left).css("top", img_top).css("position", "relative");

    // Make the img droppable
    $(drop_ID).droppable({
      drop: function(event, ui) {
        // This is code from this URL
        // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");

        // Tile was dropped
        game_board[find_board_pos(droppableID)].tile = draggableID;

        // Find out is a word is entered
        find_word();
      },
      // When a tile is moved away, remove it from the board
      out: function(event, ui) {
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");

        // Check for accidental tile movement
        if(draggableID !== game_board[find_board_pos(droppableID)].tile) {

          return;
        }

        // Mark that a tile was removed in the game_board
        game_board[find_board_pos(droppableID)].tile = "pieceX";

        // Update the word
        find_word();
      }
    });
  }
}
// I used Jason Downing's post on the Piazza for this function.  Here is the post:
// https://piazza.com/class/icm9jynacvn5kx?cid=43
function submit_word() {
  find_word(); // update word

  var word = $("#word").html();

  // will not run if player has not placed a tile
  if (word === "____") {
    $("#messages").html("<br><div> \
    Sorry, but you need to play a tile before I can check the word for you!</div>");
    console.log("Sorry you need to play a tile");
    return -1;
  }

  // lower case the word so it can be found in the dictionary

  if ( word.length > 0 && dict[ word ] ) {
    $("#messages").html("<br><div> \
    Nice job! \"" + word + "\" is in the game dictionary!<br></div>");
    console.log("Success! Your word was in the dictionary!");
    return 1;
  }
  else {
    console.log(word);
    $("#messages").html("<br><div> \
    Sorry. \"" + word + "\" is not a word in the game dictionary.</div>");
    console.log("Sorry your word was not found in the game dictionary :(");
    return -1;
  }
}

function reset_board() {

    // First clear the game board array.
    game_board = [];

    // Remove all the scrabble tiles in the rack.
    for(var i = 0; i < 7; i++) {
      var tileID = '#' + game_tiles[i].id;
      $(tileID).draggable("destroy");    // Destroys the draggable element.
      $(tileID).remove();                // Removes the tile from the page.
    }

    // loads new pieces
    load_scrabble_pieces();

    find_word(); // Wipes word/score display
    find_score();

    $("#messages").html("<br><div> \
    BOARD AND TILES RESET.</div>");

    return;
}

// Returns a random integer between min (inclusive) and max (inclusive)
// URL: https://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

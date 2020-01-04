//IDs for all the table elements. You get the cell element just by using document.getElementById("A1")
var table_ids = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]

//-1 for unplayed, 1 for X, 0 for O
var board_state = [-1,-1,-1,-1,-1,-1,-1,-1,-1]


// A flag to keep track of the status of the game, false means the game is not started. The default value is set to false
var started = false

/*
A variable to keep track of each players turn. Since the game always starts with player 1 - The default value is set to '1'
1 means player_1
0 means player_0
*/
var turn = 1

//variable to hold whether 1player or 2player mode
var vs_comp

//check if string is empty
function isEmpty(_str) {
	return (!_str || 0 === _str.length)
}

/*
@Return int This return the turn variable. Please note that
turn = 1 is for player_1 and
turn = 0 is for player_2
@Param - No param
*/
function whose_move(){
	return this.turn
}

/*
@Return void
@Param
This methods toggles the 'turn' variable.
if the turn is set to 1 it will make it 0
if the turn is set to 0 it will make it 1
*/
function toggle_move() {
	this.turn ^= 1
}

/*
@Return boolean
@Param
The method returns the value of the 'started' flag.
true means the game has started
false means the game has not started
When the game has not started the flag is set to false. As soon as the game starts the flag must be set to true.
Once the game has finished or user has clicked on reset_play the flag must be set to false.
*/
function game_started(){
	return this.started
}


//check if 1 player or 2 player was picked
function against_bot(){
	var player_choice = document.querySelector('input[name="options"]:checked').value
	return player_choice
}

//implements the AI to play
function bots_turn(dif){
	//level easy (in order)
	if(dif == 'easy'){
		for(i = 0; i < 9; i++){
			if(this.board_state[i] == -1){
				play(table_ids[i])
				return
			}
		}
	}
	//level medium (RNG)
	//level hard (manimax algo)
	if(dif == 'hard'){
		var move_index = minimax(0, this.turn)
		play(table_ids[move_index])
	}

}

function minimax(depth, isMax){
	var score = endCheck()

	if(score == "X")
		return (10 - depth)
	if(score == "O")
		return (-10 + depth)

	if(score == "T")
		return 0

	var best
	var best_move
	if(isMax)
		best = -100
	else
		best = 100

	for(var i = 0; i < 9; i++){
		if(this.board_state[i] == -1){
			this.board_state[i] = isMax
			minimax_score = minimax(depth+1, isMax ^ 1)
			if(isMax){
				if(minimax_score > best){
					best = minimax_score
					best_move = i;
				}
			}
			else{
				if(depth == 0){
					console.log("minimax_score:", minimax_score)
				}
				if(minimax_score < best){
					best = minimax_score
					best_move = i
				}
			}

			this.board_state[i] = -1

		}
	}
	if(depth == 0)
		return best_move
	else
		return best
}

function endCheck(){
	var combos = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]]
	for(var i = 0; i < 8; i++)
	{
		var first = this.board_state[combos[i][0]]
		var second = this.board_state[combos[i][1]]
		var third = this.board_state[combos[i][2]]

		if(first == second && second == third && first != -1){
			if(first == 1)
				return "X"
			else
				return "O"
		}
	}
	if(!this.board_state.includes(-1)){
		return "T"
	}
	else {
		return 0
	}
}

/*
TODO - Rule 1
This is the first method you'll implement. This method is called when the Begin Play button is clicked.
The method should do all the validations as stated in rule 1.
1. Verify if the player names are empty or not. Raise an alert if they are empty.
2. If the field are empty don't start the game. This just means the function will return and do nothing. The 'started' flag will not be modified.
3. If all verification is successful, disable the name fields and update the player moves as shown in the image.
4. If all verification is successful, update the turn information on the page. (See the source code and image). And set the started flag to true.(this will help you track at any instant if the game is in start state or not.)
5. Once game has started, Handle multiple clicks on begin play.
*/

function begin_play(){
	vs_comp = against_bot()
	if(game_started()){
		alert("Game has already started. Press Reset Play to reset")
	}
	else {
		// var player1 = document.getElementById("player1_id")
		// var player2 = document.getElementById("player2_id")
		// if(isEmpty(player1.value) || isEmpty(player2.value)){
		// 	alert("Player names cannot be empty")
		// }
		// else {
			// player1.disabled = true
			// player2.disabled = true

			var turn_info = document.getElementById("turn_info")
			turn_info.innerHTML = "Turn for: <b id=\"turn\" style=\"display: inline\">X</b>"

			this.started = true
			var begin_btn = document.getElementById("begin_btn")
			var reset_btn = document.getElementById("reset_btn")
			console.log("helo?")
			begin_btn.disabled = true
			reset_btn.disabled = false

			$(".square").html("X")

		// }
	}


}

/*
	reset board and board state
*/
function reset_play(){
	// var player1 = document.getElementById("player1_id")
	// var player2 = document.getElementById("player2_id")
	var begin_btn = document.getElementById("begin_btn")
	var move = document.getElementById("move_text_id")

	// player1.value = ""
	// player2.value = ""
	// player1.disabled = false
	// player2.disabled = false
	begin_btn.disabled = false

	var turn_info = document.getElementById("turn_info")
	turn_info.innerHTML = "No Game in Progress."

	this.board_state = [-1, -1, -1, -1, -1, -1, -1, -1, -1]

	$(".selected").toggleClass("square")
	$(".selected").toggleClass("selected")
	$(".square").html("")


	this.started = false
	this.turn = 1

}

/*
1. The moves should be validated can only be these ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]
2. Invalid moves should be reported by an alert message.(You are encorraged to use Modal which you learned in HW1 - Usage is not mandatory.)
3. If the move is a valid move, the grid should be updated with the correct move (Player 1 is always - 'X', and Player 2 is always 'O' (This is not zero!)) - The turn information should also be updated
	Hint: Use the turn variable to figure out who is currently playing. Use to toggle method to change moves.
4. A move should always be a valid move. (Example: If say a move was made in already filled cell, it should be invalidated with an alert.)
5. If the game has not started, clicking on <b>Play</b> should give an alert "The game has not started."<br/>
6. After any move, the state of the table should be validated.(see the document attached in the homework)
   If the there is winner - Show it in an alert message - (Ex - Winner is X or O) - Displaying name is not important. <br/>
7. The game should reset itself once a winner is determined.<br/>
8. After all the moves have exhausted, you're not required to display any message. (It should be obvious to Reset play.)<br/>
*/
function play(cell_choice){
	if(!this.started)
	{
		alert("The game has not started.")
		return
	}

	var turn_info = document.getElementById("turn_info")

	if(table_ids.includes(cell_choice) && this.board_state[table_ids.indexOf(cell_choice)] == -1){
		var symbol
		var whoseMove = whose_move()
		if(whoseMove)
			symbol = "X"
		else
			symbol = "O"
		var index = table_ids.indexOf(cell_choice)

		if(!whoseMove)
			console.log('BOT MOVED~!')
		this.board_state[index] = whoseMove
		$("#" + cell_choice).toggleClass("square")
		$("#" + cell_choice).toggleClass("selected")
		document.getElementById(cell_choice).innerHTML = symbol

		toggle_move()
		if(whose_move()){
			turn_info.innerHTML = "Turn for: <b id=\"turn\" style=\"display: inline\">X</b>"
			$(".square").html("X")
		}
		else{
			turn_info.innerHTML = "Turn for: <b id=\"turn\" style=\"display: inline\">O</b>"
			$(".square").html("O")
		}
		var end = endCheck()
		if(end == "X" || end == "O"){
			setTimeout(function(){alert("Winner is " + end)}, 1)
			return
		}
		else if (end == "T") {
			alert("It's a tie!")
			return
		}
		if(!whose_move() && vs_comp == 'one_player'){
			bots_turn()
		}

	}
	else{
		alert("Invalid move")
	}
	return

}

/*
Do not change this method.
*/
function moveEnter(event) {
	if(event.keyCode == 13) {
		event.preventDefault()
		play()
	}

}

$(document).ready(function(){
	var width = $(".table").css('width')
	$(".table").css('height', width)
	var height = $(".table").css('height')
	console.log(height)
})

//IDs for all the table elements. You get the cell element just by using document.getElementById("A1")
var table_ids = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"]

/*
An integer array of length 9.
Usaged: This is to store the state to the tictactoe board.
When a move is made
(Example player 1 (who is X) move at Cell 'A1' --- The board_state[0] will be made 1 )
Similarly, A move by player 2(who is O) at Cell 'A3' --- The board_state[2] will be made 0 )
We store the move of player 1 as '1' and player 2 as '0'. So after the above two moves the state should look like
[1, -1, 0, -1, -1, -1, -1, -1, -1]
*/
var board_state = [	-1,-1,-1,
					-1,-1,-1,
					-1,-1,-1 ]

/*
array for random AI model. I will mutilate this array in order to track which indexes is available and use a random
function to choose out these indexes.
*/
var index_for_random = [0, 1, 2, 3, 4, 5, 6, 7, 8]


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
var dif

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

//implements the AI to play
function bots_turn(){
	//level easy (in order)
	if(dif == 'easy'){
		let rand_index = Math.floor(Math.random() * index_for_random.length)
		let rand_move = index_for_random[rand_index]
		play(table_ids[rand_move])
	}
	//level hard (manimax algo)
	if(dif == 'hard'){
		let move_index = minimax(0, this.turn)
		play(table_ids[move_index])
	}

}

function minimax(depth, isMax){
	let score = endCheck()

	if(score == "X")
		return (10 - depth)
	if(score == "O")
		return (-10 + depth)

	if(score == "T")
		return 0

	let best
	let best_move
	if(isMax)
		best = -100
	else
		best = 100

	for(let i = 0; i < 9; i++){
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
	//when returning to bots_turn function, we only need the move, not score
	if(depth == 0)
		return best_move
	else
		return best
}

function endCheck(){
	let combos = [[0, 1, 2],[3, 4, 5],[6, 7, 8],[0, 3, 6],[1, 4, 7],[2, 5, 8],[0, 4, 8],[2, 4, 6]]
	for(let i = 0; i < 8; i++)
	{
		let first = this.board_state[combos[i][0]]
		let second = this.board_state[combos[i][1]]
		let third = this.board_state[combos[i][2]]

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

	//numplayers choice (one_player or two_player)
	vs_comp = document.querySelector('input[name="options"]:checked').value

	//difficulty chocie
	if(vs_comp == "one_player")
	 	dif = document.getElementById("level").value

	console.log(dif)

	if(game_started()){
		alert("Game has already started. Press Reset Play to reset")
	}
	else {
			let turn_info = document.getElementById("turn_info")
			turn_info.innerHTML = "Turn for: <b id=\"turn\" style=\"display: inline\">X</b>"

			this.started = true
			let begin_btn = document.getElementById("begin_btn")
			let reset_btn = document.getElementById("reset_btn")
			begin_btn.disabled = true
			reset_btn.disabled = false

			$(".square").html("X")
	}
}

/*
	reset board and board state
*/
function reset_play(){

	let begin_btn = document.getElementById("begin_btn")

	begin_btn.disabled = false

	let turn_info = document.getElementById("turn_info")
	turn_info.innerHTML = "No Game in Progress."

	this.board_state = [-1, -1, -1, -1, -1, -1, -1, -1, -1]
	this.index_for_random = [0, 1, 2, 3, 4, 5 , 6, 7, 8]

	$(".selected").toggleClass("square")
	$(".selected").toggleClass("selected")
	$(".square").html("")


	this.started = false
	this.turn = 1

}

/*
1. check if move is valid
2. play the move/adjust html/css
*/
function play(cell_choice){
	if(!this.started)
	{
		alert("The game has not started.")
		return
	}

	let turn_info = document.getElementById("turn_info")

	if(table_ids.includes(cell_choice) && this.board_state[table_ids.indexOf(cell_choice)] == -1){
		let symbol
		let whoseMove = whose_move()
		if(whoseMove)
			symbol = "X"
		else
			symbol = "O"
		let index = table_ids.indexOf(cell_choice)

		if(!whoseMove)
			console.log('BOT MOVED~!')
		this.board_state[index] = whoseMove
		index_for_random.splice(index_for_random.indexOf(index), 1)

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
		let end = endCheck()
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

$(document).ready(function(){
	$("#1player").click(function() {
		$("#difficulty").css("display", "block")
	})
	$("#2player").click(function() {
		$("#difficulty").css("display", "none")
	})
})

class Menu extends React.Component{
    render() {
        return (
            <div>
            <div className="container">
            	<form>
                    <div className="text-center menu">
                        <div className='1player numPlay radio-inline'>
                            <input id="1p" type="radio" name="options" value="one_player" onChange={()=>this.props.updateState(true)} defaultChecked/>
                            <label htmlFor="1p" >1 Player</label>
                        </div>
                        <div className='2player numPlay radio-inline'>
                            <input id="2p" type="radio" name="options" value="two_player" onChange={()=>this.props.updateState(false)}/>
                            <label htmlFor="2p" >2 Player</label>
                        </div>
                        <br/>
                        <br/>
                        <div className="form-group row">
                            <div className="col-12 ">
                                <button type="button" className="btn btn-primary" disabled={this.props.isDisabled} onClick={() => this.props.onClickBegin()} id="begin_btn">Begin Play</button>
                                <button type="button" className="btn btn-primary" disabled="" onClick={() => this.props.onClickReset()} id="reset_btn">Reset Play</button>
                            </div>
                        </div>
                    </div>
            	</form>
            </div>
            </div>
        );
    }
}

function Square(props) {
    return (
      <button className="square" onClick={props.onClick} value={props.value}>
        <div>{props.value}</div>
      </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                key={i.toString()}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }


    render() {
        let board = [];
        let row = [];
        for(let i = 0; i < 3; i++){
            row = [];
            for(let j = 0;  j < 3; j++){
                row.push(this.renderSquare(j + (i*3)));
            }
            board.push(<div key={"row"+i} className="board-row">{row}</div>)
        }

        return (
            <div>{board}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xTurn: true,
            diff: 'easy',
            one_play: true,
            began: false,
            disable_begin: false,
        };
    }

    begin_play(){
        this.setState({
            began: true,
            disable_begin: true,
        })
    }
    reset_play(){
        this.setState({
            began: false,
            disable_begin: false,
            history:  [{
                squares: Array(9).fill(null),
            }],
            xTurn: true,
        })
    }
    update_state(bool){
        console.log(bool)
        this.setState({
            one_play: bool,
        })
    }
    playMove(i){
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i] || !this.state.began){
            return;
        }
        squares[i] = this.state.xTurn ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xTurn: !this.state.xTurn
            },
            ()=>{
                if(!this.state.xTurn && this.state.one_play){
                    //call play Move again with algo
                    let history = this.state.history;
                    let current = history[history.length - 1]
                    let computer_move = minimax(0, 0, current.squares)
                    this.playMove(computer_move)
                }
            }
        );

    }
  render() {
      const history = this.state.history;
      const current = history[history.length - 1];
      const winner = calculateWinner(current.squares);

      let status;
      if(!this.state.began){
        status = "No Game in Progress";
      }
      else if(winner == 'T'){
          status = "It's a TIE!";
      }
      else if(winner){
          status = 'Winner:' + winner;
      }
      else{
          status = 'Turn for: ' + (this.state.xTurn ? 'X' : 'O');
      }
    return (
        <div>
            <Menu
                onClickBegin={() => this.begin_play()}
                onClickReset={() => this.reset_play()}
                isDisabled ={this.state.disable_begin}
                updateState={(bool) => this.update_state(bool)}

            />
            <div className="text-center">
                <div>{status}</div>
                <ol>{/* TODO */}</ol>
            </div>
            <div className="game">

                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.playMove(i)}
                        diff={this.state.diff}
                        one_play={this.state.one_play}
                        began={this.state.began}
                    />
                </div>

            </div>
        </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if(!squares.includes(null)){
      return "T";
  }
  return null;
}

function minimax(depth, isMax, squares){
	let score = calculateWinner(squares)
	if(score == "X"){
		return (10 - depth)
    }
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

    let symbol = "O"
    if(isMax)
        symbol = "X"
	for(let i = 0; i < squares.length; i++){
		if(!squares[i]){
			squares[i] = symbol
			let minimax_score = minimax(depth+1, isMax ^ 1, squares)
			if(isMax){
				if(minimax_score > best){
					best = minimax_score
					best_move = i;
				}
			}
			else{
				if(depth == 0){
				}
				if(minimax_score < best){
					best = minimax_score
					best_move = i
				}
			}

			squares[i] = null

		}
	}
	//when returning to bots_turn function, we only need the move, not score
	if(depth == 0){
		return best_move
    }
	else
		return best
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={'square ' + props.winning}  onClick={props.onClick}>
      {props.value}
    </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    
    return (<Square 
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}
    winning={this.props.winningSquares &&  this.props.winningSquares.includes(i) ? 'win' : null}
    />);
  }

  render() {

  
    const rows = [];
    for (var i = 0; i < 3; i++) {
      const squares = [];
      for (var j = 0; j < 3; j++) {
        var square = this.renderSquare(i * 3 + j);
        squares.push(square);
      }
      var row = React.createElement('div', {className: 'board-row'}, ...squares);
      rows.push(row);
    }

    return React.createElement('div', null, ...rows);
  
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        previousMove: null
      }],
      xIsNext: true,
      stepNumber: 0,
      listReversed: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, 
    this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        previousMove: i
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      history: this.state.history.slice(0, step + 1)
    });
  }

  reverseList = () => {
      var list = document.querySelector('ol');
      list.classList.toggle('reverse');
      list.childNodes.forEach(item => item.classList.toggle('reverse'));
      this.setState({
        listReversed: !this.state.listReversed
      });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let className = null;
      if (this.state.listReversed) {
        className = 'reverse';
      }

      const desc = move ? 'Go to move #' + move : 
      'Go to game start';
      let location = null;
      if (step.previousMove !== null) {
        location = `(${step.previousMove%3}, ${Math.floor(step.previousMove/3)})`;
      }
      
      return (
        <li key={move} className={className}>
          <button onClick={() => this.jumpTo(move)}>{desc} {location}</button>
        </li>
        );
    });

    let status;
    let winningSquares = null;
    if (winner && winner !== 'draw') {
      status = 'Winner: ' + winner.piece;
      winningSquares = winner.squares;
    } else if (winner === 'draw') {
      status = 'Tic-tac-toe: it was a draw!';
    } else {
      status = 'Next player: ' + 
      (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
          winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <br />
          <button onClick={this.reverseList}>Reverse list order</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return {
        piece: squares[a],
        squares: [a, b, c]
      };
    }
  }
  if (squares.every(sq => sq !== null)) {
    return 'draw';
  }
  return null;
}

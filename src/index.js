import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}
  
  class Board extends React.Component {

    renderSquare(i) {
      return <Square 
        value={this.props.squares[i]}
        onClick={ () => this.props.onClick(i) }
      />;
    }

    createboard = () => {
        let board = []
        
        let x = 0;
        // Outer loop to create parent
        for (let i = 0; i < 3; i++) {
          let children = []
          //Inner loop to create children
          for (let j = 0; j < 3; j++) {
            children.push(this.renderSquare(x));
            x++;
          }
          //Create the parent and add the children
          board.push(<div className="board-row" key={i}>{children}</div>);
        }
        return board
    }
  
    render() {
      return (
        <div>
          {this.createboard()}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move: 0,
                selected: false,
            }],
            xIsNext: true,
            stepNumber: 0,
            reverse: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([{
                squares: squares,
                move: i + 1,
                selected: false,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            });
    }

    jumpTo(move) {
        this.setState({
            stepNumber: move,
            xIsNext: (move % 2) === 0,
            selected: true,
        });
        
    }

    reverseMoves() {
        this.setState({
            reverse: !this.state.reverse,
        });
        
    }

    render() {
      let history;
      let current;
      if (this.state.reverse) {
        history = this.state.history.slice().reverse();
        current = history[-(this.state.stepNumber - this.state.history.length + 1)];
      } else {
        history = this.state.history.slice();
        current = history[this.state.stepNumber];
      }

      //const current = history[this.state.stepNumber];    
      const winner = calculateWinner(current.squares);
         
                           //(valorAtual, indice, array) 
      const moves = history.map((step, move) => {
              
          const col = step.move % 3 === 0 ? 3:step.move % 3;
          const line = Math.ceil(step.move / 3);
          const desc = step.move ?
            'Go to move #(' + line + ', ' + col  + ')':
            'Go to game start';
            
          let actual;
          if (this.state.reverse) {
            actual = -(move - this.state.history.length + 1);
          } else {
            actual = move;
          }
            
          return (
              <li key={move}>
                  <button onClick={ () => this.jumpTo(actual) } style={ actual === this.state.stepNumber ? 
                  {fontWeight: 'bold'} : {fontWeight: 'normal'}}>
                      {desc}
                  </button>
              </li>
          );
      });

      let status;    
      if (winner) {      
          status = 'Winner: ' + winner;    
        } else {
            if (current.squares.includes(null)) {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');    
            } else {
                status = "Game Draw";
            }    
        }

      let board = <Board squares={current.squares} 
        onClick={ (i) => this.handleClick(i) }/>;

      return (
        <div className="game">
            
          <div className="game-board">
            {board}
          </div>
          <div className="game-info">
            <div>{ status }</div>
            <div><button onClick={ () => this.reverseMoves()}>Sort</button></div>
            <ol id="moves">{ moves }</ol>
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
          if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
              return squares[a]
          }
      }
      return null;
  }

  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );


  

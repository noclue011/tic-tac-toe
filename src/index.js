import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import Square from './components/Square';
import './index.css';

//React.components are component classes that take in parameters called props

  class Board extends React.Component {

    renderSquare(i) {
      return ( 
      <Square 
        //Passes the current value shown in squares array to the actual square 
        //along with a function for when the square is clicked
        style = {this.props.style[i]}
        value = {this.props.squares[i]}
        onClick = {() => this.props.onClick(i)} 

      />
      )
    }
  
    //render returns a description (REACT ELEMENT) of what we want to see on the screen
    //React takes that description and displays a results
    render() {
        //will generate the game board each time the state of the board changes
        const board = []
        let row = []
        let t = 0
        for (let i = 0; i < 7; i = i + 3) {
            for (let x = 0; x < 3; x++) {
                t = x + i
                row.push(<p key = {t}>{this.renderSquare(t)}</p>)
            }
            board.push(<div className = "board-row" key = {i}>{row}</div>)
            row = []
        }
      //<div /> is transformed to React.createElement('div') at build time
      return (
        <div>
          {board}
        </div>
      );
    }
  }

  //Creates the toggle switch
  const ToggleSwitch = () => {

    return (
      <label className = "switch" id = "checkbox">
                <input 
                  className = "switch-input"
                  type = "checkbox" 
                  id = "toggleMoves" 
                  defaultChecked
                  />
                <span className = "slider round" id = "checkbox"></span>
      </label>
    )
  }
  
  class Game extends React.Component {
    
    //Constructor for Game
    //super(props) must be included in each instructor
    constructor(props) {
        super(props);
        //Sets the initial state for the game 
        //We will store the games state in the parent game instead of the children square and board
        this.state = {
            //stores different properties in history so they can be grabbed from the "go to move" buttons 
            history: [{
                backgroundColor: Array(9).fill('white'),
                squares: Array(9).fill(null),
                columns: [1, 2, 3, 1, 2, 3, 1, 2, 3],
                rows: [1, 1, 1, 2, 2, 2, 3, 3, 3],
                turn: 0,
            }],
            result : true,
            stepNumber : 0,
            //will ensure X goes first
            xIsNext: true,
        };
    }

    handleClick(i) {
        //.slice() creates a copy of the squares array that can be modified instead of the existing array
        //Allows us to change the data without mutations
        const history = this.state.history.slice(0, this.state.stepNumber + 1);    
        const current = history[history.length - 1];
        
        var backgroundColor = current.backgroundColor.slice();
        const squares = current.squares.slice();
        const columns = current.columns;
        const rows = current.rows;
        const lastColumn = current.columns[i];
        const lastRow = current.rows[i];
        const turn = current.turn + 1;

        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        //Resets the background color of the board, then changes the square that was last clicked
        backgroundColor = Array(9).fill('white');
        backgroundColor[i] = 'lightblue';

        //What the state is depends on what the boolean value is
        squares[i] = this.state.xIsNext ? 'X' :'O';
        this.setState({

            //concat doesn't mutate the original array
            history: history.concat([{
                //Creates a new history instance with its own properties
                //lastColumn/Row stores the row/column values of the last square clicked
                backgroundColor: backgroundColor,
                squares: squares,
                columns: columns,
                rows: rows,
                lastColumn: lastColumn,
                lastRow: lastRow,
                turn: turn
            }]),
            result : document.getElementsByClassName("switch-input")[0].checked,
            stepNumber: history.length,
            //Changes whose turn it is
            xIsNext: !this.state.xIsNext,
        });
    }

    //Changes the state of the game board to a previous state
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    changeMoveOrder() {
      console.log("test");
    }
    
    //Checks if there is a winner for the game
    calculateWinner(squares) {
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

            //returns the winning squares along with the winning side
            const array = [a, b, c, squares[a]];
            return array;
          }
      }
      return (null);
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = this.calculateWinner(current.squares);
      const x = this.state.result;
      
      //step stores the current history data from the current step
      //Includes all properties like squares, columns, lastRow, etc.
      const moves = history.map((step, move) => {
          
          const desc = move ?
          'Go to move #' + move + ' / [col: ' + step.lastColumn + ' row: ' + step.lastRow + ' / ' + ' ]':
          'Go to game start';
          return (
              <li key = {move}>
                  <button onClick = {() => this.jumpTo(move)}>{desc}</button>
              </li>
          );
      });

      //flipping the switch changes the order that the moves appear in
      if (x == false) {
        moves.reverse();
      } 

      var backgroundColor = current.backgroundColor.slice();

      let status;
      //Will either declare a winner or say who goes next depending on the state of the game
      if (winner) {
          //color in the winning squares
          backgroundColor = Array(9).fill('white');
          backgroundColor[winner[0]] = 'lightblue';
          backgroundColor[winner[1]] = 'lightblue';
          backgroundColor[winner[2]] = 'lightblue';

          status = 'Winner: ' + winner[3];
      } else if (current.turn < 9) {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
          status = 'Draw';
      }

      return (
        <div className = "game">
          <div className = "game-board">
            <Board 
                style = {backgroundColor}
                squares = {current.squares}
                onClick = {(i) => this.handleClick(i)}
            />
          </div>
          <div className = "game-info">
          {/*handles the switch on the page*/}
            <ToggleSwitch 
              id = "toggleMoves"
              onChange = {() => this.changeMoveOrder()}
            />
            <span className = "switch-label">Use toggle to change sort order for previous moves</span>
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  //The main function that renders the page by calling the 'Game' component
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
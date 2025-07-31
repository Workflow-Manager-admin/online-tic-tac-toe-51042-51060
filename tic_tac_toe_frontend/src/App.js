import React, { useState } from "react";
import "./App.css";

/**
 * Color palette and layout requirements from project details:
 * primary: #1976D2, secondary: #1565C0, accent: #FF5722; modern, minimalistic, responsive
 */

// PUBLIC_INTERFACE
function App() {
  // Board: 0-8; null = empty, "X" or "O"
  const [board, setBoard] = useState(Array(9).fill(null));
  // Next player: true = X, false = O
  const [xIsNext, setXIsNext] = useState(true);
  // "winner": 'X' | 'O' | 'draw' | null
  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);

  // PUBLIC_INTERFACE
  /** Reset game state */
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  /** Process click on a cell */
  function handleClick(idx) {
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  }

  /** Header status message */
  let status;
  if (winner === "X" || winner === "O") status = `Winner: ${winner}`;
  else if (isDraw) status = "Draw!";
  else status = `Next: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="App app-tictactoe">
      <main className="ttt-container">
        <h1 className="ttt-header" data-testid="header">Tic Tac Toe</h1>
        <Status status={status} />
        <Board board={board} onCellClick={handleClick} winnerLine={getWinnerLine(board)} />
        <div className="ttt-controls">
          <button className="ttt-btn ttt-btn-reset" onClick={handleReset} data-testid="reset">
            Reset
          </button>
        </div>
      </main>
      <footer className="ttt-footer">
        <span>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="ttt-link"
          >
            React
          </a>{" "}
          Tic Tac Toe &copy; {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Status({ status }) {
  return <div className="ttt-status" data-testid="status">{status}</div>;
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, winnerLine }) {
  // Render 3x3 grid
  return (
    <div className="ttt-board" data-testid="board">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          highlight={winnerLine && winnerLine.includes(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, onClick, highlight }) {
  const classes = "ttt-cell" + (highlight ? " ttt-winning-cell" : "");
  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={Boolean(value)}
      data-testid={`cell-${value || "empty"}`}
      tabIndex={0}
      aria-label={value ? `Cell: ${value}` : "Empty cell"}
      style={
        highlight
          ? { color: "var(--accent)", borderColor: "var(--accent)" }
          : undefined
      }
    >
      {value}
    </button>
  );
}

/**
 * Returns 'X', 'O', or null if no winner
 * @param {Array} board 
 */
function getWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return board[a];
    }
  }
  return null;
}

/**
 * Returns an array of indices (winning line) if there is a winner, else null
 * @param {Array} board 
 */
function getWinnerLine(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return line;
    }
  }
  return null;
}

export default App;

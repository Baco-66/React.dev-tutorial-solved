import { useState } from "react";

// Added a conditional check to render the highlighted square in case of a win
function Square({ value, winner, handleClick }) {
  return (
    <button
      className={`square ${winner ? "highlight" : "normal"}`}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

function Board({ player, board, onPlay }) {
  const { winner, winningSquares } = calculateWinner(board);
  let status = winner ? winner : "Next player is " + player;

  function handleClick(i) {
    if (winner || board[i]) {
      return;
    }
    const nextBoard = board.slice();
    nextBoard[i] = player;

    onPlay(nextBoard, i);
  }

  function renderSquare(i) {
    return (
      <Square
        value={board[i]}
        winner={winningSquares.includes(i)}
        handleClick={() => handleClick(i)}
      />
    );
  }

  return (
    // Made this use two loops to make the board insead of it being hardcoded
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((_, row) => (
          <div className="board-row">
            {Array(3)
              .fill(null)
              .map((_, col) => renderSquare(row * 3 + col))}
          </div>
        ))}
    </>
  );
}

export default function Game() {
  // Changed the history to keep track of the index that was changed in each move
  const [history, setHistory] = useState([[Array(9).fill(null), -1]]);
  const [currentMove, setCurrentMove] = useState(0);
  const board = history[currentMove][0];
  // Added this variable to change the order of the list of moves
  const [orderIsDown, setOrderIsDown] = useState(true);

  function hanndlePlay(nextBoard, index) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      [nextBoard, index],
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // This conditional changes the order of the history
  const orderedMoves = orderIsDown ? history : history.slice().reverse();

  // I didnt like the first message being different from the others so i removed that
  // Added a special message to identify what move you are in
  // Added the col and row the move was made in
  const moves = orderedMoves.map(([_, index], move) => (
    <li key={move}>
      {move === currentMove ? (
        <p>You are at move #{move}</p>
      ) : (
        <button onClick={() => jumpTo(move)}>
          Go to move #{move}
          {index !== -1 && `(${Math.floor(index / 3) + 1}, ${(index % 3) + 1})`}
        </button>
      )}
    </li>
  ));

  return (
    <div className="game">
      <div className="game-board">
        <Board
          player={currentMove % 2 == 0 ? "X" : "O"}
          board={board}
          onPlay={hanndlePlay}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setOrderIsDown(!orderIsDown)}>
          Change order of moves!
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Changed the return to a tuple with the information necessary to highlight the winning squares
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
      return { winner: "Winner is " + squares[a], winningSquares: [a, b, c] };
    }
  }
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] == null) {
      return { winner: null, winningSquares: [] };
    }
  }
  return { winner: "Draw!", winningSquares: [] };
}

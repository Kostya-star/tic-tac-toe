import { BoardType } from 'types/Board';

const winLines = [
  // Horizontal lines
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Vertical lines
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonal lines
  [0, 4, 8],
  [2, 4, 6],
];

export const calculateWinner = (board: BoardType) => {
  for (const line of winLines) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // return board[a]; // Return the symbol of the winner (X or O)
      return {
        winner: board[a],
        line
      }
    }
  }

  return null; // Return null if there is no winner
};

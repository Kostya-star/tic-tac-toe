import { BoardType } from 'types/Board';

// various case scenarious for win cells indexes
const winLines = [
  // horizontal lines
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // vertical lines
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonal lines
  [0, 4, 8],
  [2, 4, 6],
];

// if there is winner, return it and their win cells coordinates, otherwise return null
export const calculateWinner = (board: BoardType) => {
  for (const line of winLines) {
    const [a, b, c] = line;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // return board[a] - the symbol of the winner (X or O)
      return {
        winner: board[a],
        // win cells coordinates
        line
      }
    }
  }

  return null; // Return null if there is no winner
};

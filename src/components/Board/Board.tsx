import { Square } from 'components/Square/Square';
import cls from './Board.module.scss';
import { FC } from 'react';
import { BoardType, PLAYERS } from 'types/Board';

interface BoardProps {
  board: BoardType;
  player: PLAYERS
  onSquareClick: (num: number, player: PLAYERS) => void;
}

export const Board: FC<BoardProps> = ({ board, player, onSquareClick }) => {
  return (
    <div className={cls.board}>
      {board.map((sign, ind) => (
        <Square key={ind} value={sign} onSquareClick={() => onSquareClick(ind, player)} />
      ))}
    </div>
  );
};

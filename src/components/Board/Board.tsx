import { Square } from 'components/Square/Square';
import cls from './Board.module.scss';
import { FC } from 'react';
import { BoardType } from 'types/Board';

interface BoardProps {
  board: BoardType;
  onSquareClick: (num: number) => void;
}

export const Board: FC<BoardProps> = ({ board, onSquareClick }) => {
  return (
    <div className={cls.board}>
      {board.map((sign, ind) => (
        <Square key={ind} value={sign} onSquareClick={() => onSquareClick(ind)} />
      ))}
    </div>
  );
};

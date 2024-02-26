import { FC } from 'react';
import cls from './Square.module.scss';

interface SquareProps {
  value: string | null;
  onSquareClick: () => void;
}

export const Square: FC<SquareProps> = ({ value, onSquareClick }) => {
  return (
    <button className={cls.square} onClick={onSquareClick}>
      {value}
    </button>
  );
};

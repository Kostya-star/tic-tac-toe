import { FC } from 'react';
import cls from './Header.module.scss';
import { PLAYERS } from 'types/Board';

interface HeaderProps {
  score: Record<PLAYERS, number>;
  resetGame: () => void
}

export const Header: FC<HeaderProps> = ({ score, resetGame }) => {
  return (
    <div className={cls.header}>
      <div>Player 1</div>
      <div className={cls.score}>
        <span>Score: {score.X}:{score.O}</span>
        <button className={cls.resetBtn} onClick={resetGame}>
          Reset
        </button>
      </div>
      <div>Player 2</div>
    </div>
  );
};

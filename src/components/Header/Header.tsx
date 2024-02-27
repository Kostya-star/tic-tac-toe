import { FC } from 'react';
import cls from './Header.module.scss';
import { PLAYERS } from 'types/Board';
import { Button } from 'components/UI/Button/Button';

interface HeaderProps {
  score: Record<PLAYERS, number>;
  resetGame: () => void;
}

export const Header: FC<HeaderProps> = ({ score, resetGame }) => {
  return (
    <div className={cls.header}>
      <div>Player 1</div>
      <div className={cls.score}>
        <span>
          Score: {score.X}:{score.O}
        </span>
        <Button onClick={resetGame} type="success">
          Reset
        </Button>
      </div>
      <div>Player 2</div>
    </div>
  );
};

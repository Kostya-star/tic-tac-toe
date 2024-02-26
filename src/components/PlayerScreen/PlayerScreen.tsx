import { Board } from 'components/Board/Board';
import cls from './PlayerScreen.module.scss';
import { FC } from 'react';
import { BoardType } from 'types/Board';
import { PLAYER_STATUS } from 'types/GameStatus';

interface PlayerScreenProps {
  board: BoardType;
  status: PLAYER_STATUS;
  onSquareClick: (num: number) => void;
}

export const PlayerScreen: FC<PlayerScreenProps> = ({ board, status, onSquareClick }) => {
  const isWin = status === PLAYER_STATUS.WIN;
  const isLost = status === PLAYER_STATUS.LOST;

  const winLostStatus = isWin ? cls.status_win : isLost ? cls.status_lost : '';

  return (
    <div className={cls.screen}>
      <div className={`${cls.status} ${winLostStatus}`}>{status}</div>
      <Board board={board} onSquareClick={onSquareClick} />
      <span>chat</span>
    </div>
  );
};

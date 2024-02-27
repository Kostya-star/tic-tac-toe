import cls from './Board.module.scss';
import { FC } from 'react';
import { BoardType, PLAYERS } from 'types/Board';
import { PLAYER_STATUS } from 'types/GameStatus';

interface BoardProps {
  board: BoardType;
  status: PLAYER_STATUS;
  player: PLAYERS;
  winCords: number[];
  onCellClick: (num: number, player: PLAYERS) => void;
}

export const Board: FC<BoardProps> = ({ board, status, player, winCords, onCellClick }) => {
  const isWin = status === PLAYER_STATUS.WIN;
  const isLost = status === PLAYER_STATUS.LOST;

  // determine win-lost status to color the status
  const winLostStatus = isWin ? cls.status_win : isLost ? cls.status_lost : '';

  // determine win cells to color them
  function isWinCell(cellInd: number) {
    return winCords.length && winCords.includes(cellInd);
  }

  return (
    <div className={cls.board}>
      <div className={`${cls.status} ${winLostStatus}`}>{status}</div>
      <div className={cls.content}>
        {board.map((sign, ind) => (
          <button key={ind} className={`${cls.cell} ${isWinCell(ind) ? cls.cell_win : ''}`} onClick={() => onCellClick(ind, player)}>
            {sign}
          </button>
        ))}
      </div>
    </div>
  );
};

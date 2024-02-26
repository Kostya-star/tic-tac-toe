import { Header } from 'components/Header/Header';
import cls from './Game.module.scss';
import { PlayerScreen } from 'components/PlayerScreen/PlayerScreen';
import { useEffect, useRef } from 'react';
import { GAME_STATUS } from 'types/GameStatus';
import { resetGame, setIsPlayerX, setPlayersStatus, setScore, squareClick } from 'store/slices/game';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { calculateWinner } from 'utils/calculateWinner';

export const Game = () => {
  const { board, playersStatus, score } = useAppSelector(({ game }) => ({
    board: game.board,
    playersStatus: game.playersStatus,
    score: game.score
  }));

  const dispatch = useAppDispatch();

  const isGameStarted = useRef(false);

  const onSquareClick = (cellInd: number) => {
    if (calculateWinner(board) || board[cellInd]) {
      return;
    }

    dispatch(squareClick(cellInd));
  };

  useEffect(() => {
    if (!isGameStarted.current) {
      isGameStarted.current = true;
      return;
    }

    const winner = calculateWinner(board);

    if (winner) {
      dispatch(setPlayersStatus({ status: GAME_STATUS.WIN_LOST, winner }));
      dispatch(setScore(winner))
    } else if (board.every(Boolean)) {
      dispatch(setPlayersStatus({ status: GAME_STATUS.DRAW }));
    } else {
      dispatch(setIsPlayerX());
      dispatch(setPlayersStatus({ status: GAME_STATUS.PLAYING }));
    }
  }, [board, dispatch]);

  const onResetGame = () => {
    isGameStarted.current = false;
    dispatch(resetGame());
  };

  return (
    <div className={cls.game}>
      <div className={cls.content}>
        <Header resetGame={onResetGame} score={score}/>
        <div className={cls.players}>
          <PlayerScreen board={board} status={playersStatus.X} onSquareClick={onSquareClick} />
          <PlayerScreen board={board} status={playersStatus.O} onSquareClick={onSquareClick} />
        </div>
      </div>
    </div>
  );
};

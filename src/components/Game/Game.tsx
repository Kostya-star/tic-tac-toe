import { Header } from 'components/Header/Header';
import cls from './Game.module.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GAME_STATUS } from 'types/GameStatus';
import { resetGame, setIsPlayerX, setPlayersStatus, setScore, setWinLine, squareClick } from 'store/slices/game';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { calculateWinner } from 'utils/calculateWinner';
import { PLAYERS } from 'types/Board';
import { ProgressLinear } from 'components/UI/ProgressLinear/ProgressLinear';
import { Button } from 'components/UI/Button/Button';
import { Board } from 'components/Board/Board';

const TIMEOUT_DELAY = 5000;

export const Game = () => {
  const { board, playersStatus, score, isPlayerXTurn, winCords } = useAppSelector(({ game }) => ({
    board: game.board,
    playersStatus: game.playersStatus,
    score: game.score,
    isPlayerXTurn: game.isPlayerX,
    winCords: game.winCords,
  }));

  const dispatch = useAppDispatch();

  const isGameStarted = useRef(false);

  const [isProgessBar, setProgressBar] = useState(false);

  const onResetGameMemoized = useCallback(
    (isResetScore: boolean = false) => {
      isGameStarted.current = false;
      dispatch(resetGame(isResetScore));
      setProgressBar(false);
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isGameStarted.current) {
      isGameStarted.current = true;
      return;
    }

    const winnerInfo = calculateWinner(board);
    let resetTimer: NodeJS.Timeout | null = null;

    if (winnerInfo?.winner) {
      dispatch(setPlayersStatus({ status: GAME_STATUS.WIN_LOST, winner: winnerInfo.winner }));
      dispatch(setScore(winnerInfo.winner));
      dispatch(setWinLine(winnerInfo.line));

      setProgressBar(true);

      resetTimer = setTimeout(() => {
        onResetGameMemoized();
        setProgressBar(false);
        dispatch(setWinLine([]));
      }, TIMEOUT_DELAY);
    } else if (board.every(Boolean)) {
      dispatch(setPlayersStatus({ status: GAME_STATUS.DRAW }));
      setProgressBar(true);

      resetTimer = setTimeout(() => {
        onResetGameMemoized();
        setProgressBar(false);
      }, TIMEOUT_DELAY);
    } else {
      dispatch(setIsPlayerX());
      dispatch(setPlayersStatus({ status: GAME_STATUS.PLAYING }));
    }

    return () => {
      if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    };
  }, [board, dispatch, onResetGameMemoized]);

  const onCellClick = (cellInd: number, player: PLAYERS) => {
    if (calculateWinner(board)?.winner || board[cellInd]) {
      return;
    }

    // disable the other board when it's not its turn
    if (isPlayerXTurn && player === PLAYERS.PLAYER_O) return;
    if (!isPlayerXTurn && player === PLAYERS.PLAYER_X) return;

    dispatch(squareClick(cellInd));
  };

  return (
    <div className={cls.game}>
      <Header resetGame={() => onResetGameMemoized(true)} score={score} />
        <div className={cls.boards}>
          <Board 
            board={board} 
            status={playersStatus.x} 
            player={PLAYERS.PLAYER_X} 
            winCords={winCords} 
            onCellClick={onCellClick} 
          />
          <Board 
            board={board} 
            status={playersStatus.o} 
            player={PLAYERS.PLAYER_O} 
            winCords={winCords} 
            onCellClick={onCellClick} 
          />
        </div>

        <div className={cls.restart_game}>
          <Button type="success" onClick={onResetGameMemoized}>
            Restart Game
          </Button>
        </div>

        {isProgessBar ? <ProgressLinear /> : null}
    </div>
  );
};

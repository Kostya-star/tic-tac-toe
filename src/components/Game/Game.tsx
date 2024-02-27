import { Header } from 'components/Header/Header';
import cls from './Game.module.scss';
import { PlayerScreen } from 'components/PlayerScreen/PlayerScreen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GAME_STATUS } from 'types/GameStatus';
import { resetGame, setIsPlayerX, setPlayersStatus, setScore, squareClick } from 'store/slices/game';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { calculateWinner } from 'utils/calculateWinner';
import { PLAYERS } from 'types/Board';
import { ProgressLinear } from 'components/UI/ProgressLinear/ProgressLinear';
import { Button } from 'components/UI/Button/Button';

const TIMEOUT_DELAY = 5000;

export const Game = () => {
  const { board, playersStatus, score, isPlayerXTurn } = useAppSelector(({ game }) => ({
    board: game.board,
    playersStatus: game.playersStatus,
    score: game.score,
    isPlayerXTurn: game.isPlayerX,
  }));

  const dispatch = useAppDispatch();

  const isGameStarted = useRef(false);

  const [isProgessBar, setProgressBar] = useState(false);

  const onResetGameMemoized = useCallback((isResetScore?: boolean) => {
    console.log(isResetScore);
    
    isGameStarted.current = false;
    dispatch(resetGame());
    setProgressBar(false);
  }, [dispatch]);

  useEffect(() => {
    if (!isGameStarted.current) {
      isGameStarted.current = true;
      return;
    }

    const winner = calculateWinner(board);
    let resetTimer: NodeJS.Timeout | null = null;

    if (winner) {
      dispatch(setPlayersStatus({ status: GAME_STATUS.WIN_LOST, winner }));
      dispatch(setScore(winner));
      setProgressBar(true);

      resetTimer = setTimeout(() => {
        onResetGameMemoized();
        setProgressBar(false);
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

  const onSquareClick = (cellInd: number, player: PLAYERS) => {
    if (calculateWinner(board) || board[cellInd]) {
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
      <div className={cls.content}>
        <div className={cls.players}>
          <PlayerScreen board={board} status={playersStatus.X} player={PLAYERS.PLAYER_X} onSquareClick={onSquareClick} />
          <PlayerScreen board={board} status={playersStatus.O} player={PLAYERS.PLAYER_O} onSquareClick={onSquareClick} />
        </div>

        <div className={cls.reset_game}>
          <Button type='success' onClick={onResetGameMemoized}>New Game</Button>
        </div>

        {isProgessBar ? <ProgressLinear /> : null}
      </div>
    </div>
  );
};

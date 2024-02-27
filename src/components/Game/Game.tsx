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

// delay after the game is over before the new game
const TIMEOUT_DELAY = 5000;

export const Game = () => {
  const { board, playersStatus, score, isPlayerXTurn, winCords } = useAppSelector(({ game }) => ({
    board: game.board, // [x, o, null, x, null.....]
    playersStatus: game.playersStatus, // current players statuses
    score: game.score,
    isPlayerXTurn: game.isPlayerX, // get players turn
    winCords: game.winCords, // win coordinates for cells
  }));

  const dispatch = useAppDispatch();

  const isGameStarted = useRef(false);

  const [isProgessBar, setProgressBar] = useState(false);

  // function that resets both scores(if needed), boards, statuses, win cells and set the progress bar
  const onResetGameMemoized = useCallback(
    (isResetScore: boolean = false) => {
      isGameStarted.current = false;
      dispatch(resetGame(isResetScore));
      setProgressBar(false);
      dispatch(setWinLine([]));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isGameStarted.current) {
      // prevent useEffect from firing on first render
      isGameStarted.current = true;
      return;
    }

    // get winner and their win cells coordinates
    const winnerInfo = calculateWinner(board);
    let resetTimer: NodeJS.Timeout | null = null;

    if (winnerInfo?.winner) {
      // WIN CASE
      dispatch(setPlayersStatus({ status: GAME_STATUS.WIN_LOST, winner: winnerInfo.winner }));
      dispatch(setScore(winnerInfo.winner));
      dispatch(setWinLine(winnerInfo.line));

      setProgressBar(true);

      // after the game is WON, show the result for 5s
      resetTimer = setTimeout(() => {
        onResetGameMemoized();
        setProgressBar(false);
        dispatch(setWinLine([]));
      }, TIMEOUT_DELAY);
    } else if (board.every(Boolean)) {
      // DRAW CASE
      dispatch(setPlayersStatus({ status: GAME_STATUS.DRAW }));
      setProgressBar(true);

      // after the game is DRAW, show the result for 5s
      resetTimer = setTimeout(() => {
        onResetGameMemoized();
        setProgressBar(false);
      }, TIMEOUT_DELAY);
    } else {
      // GAME IN PROCESS CASE
      dispatch(setIsPlayerX());
      dispatch(setPlayersStatus({ status: GAME_STATUS.PLAYING }));
    }

    // cleanup
    return () => {
      if (resetTimer !== null) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }
    };
  }, [board, dispatch, onResetGameMemoized]);

  // when clicking on a board cell
  const onCellClick = (cellInd: number, player: PLAYERS) => {
    // if we have a winner or the cell is clicked, return
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
      {/* reset everything including score */}
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

      {/* reset everything except score */}
      <div className={cls.restart_game}>
        <Button type="success" onClick={onResetGameMemoized}>
          Restart Game
        </Button>
      </div>

      {/* progress bar that appears when the game is over */}
      {isProgessBar ? <ProgressLinear /> : null}
    </div>
  );
};

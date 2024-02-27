import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { BoardType, PLAYERS } from 'types/Board';
import { GAME_STATUS, PLAYER_STATUS } from 'types/GameStatus';

interface StatusPayload {
  status: GAME_STATUS;
  winner?: PLAYERS;
}

const initialPlayersStatus = {
  X: PLAYER_STATUS.GAME_START_WAIT,
  O: PLAYER_STATUS.GAME_START_TURN,
};

const initialScore = {
  X: 0,
  O: 0,
};

export interface GameState {
  board: BoardType;
  isPlayerX: boolean;
  playersStatus: Record<PLAYERS, PLAYER_STATUS>;
  score: Record<PLAYERS, number>;
}

const initialState: GameState = {
  board: Array(9).fill(null),
  isPlayerX: false,
  playersStatus: initialPlayersStatus,
  score: initialScore,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    squareClick: (state, { payload: cellInd }: PayloadAction<number>) => {
      state.board[cellInd] = state.isPlayerX ? PLAYERS.PLAYER_X : PLAYERS.PLAYER_O;
    },
    setPlayersStatus: (state, { payload }: PayloadAction<StatusPayload>) => {
      const { status, winner } = payload;

      switch (status) {
        case GAME_STATUS.WIN_LOST:
          state.playersStatus = {
            X: winner === PLAYERS.PLAYER_X ? PLAYER_STATUS.WIN : PLAYER_STATUS.LOST,
            O: winner === PLAYERS.PLAYER_O ? PLAYER_STATUS.WIN : PLAYER_STATUS.LOST,
          };
          break;

        case GAME_STATUS.DRAW:
          state.playersStatus = {
            X: PLAYER_STATUS.DRAW,
            O: PLAYER_STATUS.DRAW,
          };
          break;

        case GAME_STATUS.PLAYING:
          state.playersStatus = {
            X: state.isPlayerX ? PLAYER_STATUS.YOUR_TURN : PLAYER_STATUS.WAIT_OPPONENT,
            O: state.isPlayerX ? PLAYER_STATUS.WAIT_OPPONENT : PLAYER_STATUS.YOUR_TURN,
          };
          break;

        default:
          break;
      }
    },
    setIsPlayerX: (state) => {
      state.isPlayerX = !state.isPlayerX;
    },
    resetGame: (state) => {
      state.board = Array(9).fill(null);
      state.isPlayerX = false;
      state.playersStatus = initialPlayersStatus;
      // state.score = initialScore
    },
    setScore: (state, { payload: winner }: PayloadAction<PLAYERS>) => {
      state.score[winner]++;
    },
  },
});

// Action creators are generated for each case reducer function
export const { squareClick, setPlayersStatus, setIsPlayerX, resetGame, setScore } = gameSlice.actions;

export default gameSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { BoardType, PLAYERS } from 'types/Board';
import { GAME_STATUS, PLAYER_STATUS } from 'types/GameStatus';

interface StatusPayload {
  status: GAME_STATUS;
  winner?: PLAYERS;
}

const initialPlayersStatus = {
  x: PLAYER_STATUS.GAME_START_WAIT,
  o: PLAYER_STATUS.GAME_START_TURN,
};

const initialScore = {
  x: 0,
  o: 0,
};

export interface GameState {
  board: BoardType;
  isPlayerX: boolean;
  playersStatus: Record<PLAYERS, PLAYER_STATUS>;
  score: Record<PLAYERS, number>;
  winCords: number[]
}

const initialState: GameState = {
  board: Array(9).fill(null),
  isPlayerX: false,
  playersStatus: initialPlayersStatus,
  score: initialScore,
  winCords: []
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
            x: winner === PLAYERS.PLAYER_X ? PLAYER_STATUS.WIN : PLAYER_STATUS.LOST,
            o: winner === PLAYERS.PLAYER_O ? PLAYER_STATUS.WIN : PLAYER_STATUS.LOST,
          };
          break;

        case GAME_STATUS.DRAW:
          state.playersStatus = {
            x: PLAYER_STATUS.DRAW,
            o: PLAYER_STATUS.DRAW,
          };
          break;

        case GAME_STATUS.PLAYING:
          state.playersStatus = {
            x: state.isPlayerX ? PLAYER_STATUS.YOUR_TURN : PLAYER_STATUS.WAIT_OPPONENT,
            o: state.isPlayerX ? PLAYER_STATUS.WAIT_OPPONENT : PLAYER_STATUS.YOUR_TURN,
          };
          break;

        default:
          break;
      }
    },
    setIsPlayerX: (state) => {
      state.isPlayerX = !state.isPlayerX;
    },
    resetGame: (state, { payload: isResetScore }) => {
      state.board = Array(9).fill(null);
      state.isPlayerX = false;
      state.playersStatus = initialPlayersStatus;
      if (isResetScore) {
        state.score = initialScore;
      }
    },
    setScore: (state, { payload: winner }: PayloadAction<PLAYERS>) => {
      state.score[winner]++;
    },
    setWinLine: (state, { payload: coordinates }: PayloadAction<number[]>) => {
      state.winCords = coordinates
    }
  },
});

// Action creators are generated for each case reducer function
export const { squareClick, setPlayersStatus, setIsPlayerX, resetGame, setScore, setWinLine } = gameSlice.actions;

export default gameSlice.reducer;

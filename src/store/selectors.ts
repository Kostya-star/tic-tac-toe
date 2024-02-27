import { createSelector, createStructuredSelector } from 'reselect';
import { RootState } from 'store';

const selectGame = (state: RootState) => state.game;

// memoized selector
export const selectGameInfo = createStructuredSelector({
  board: createSelector([selectGame], (game) => game.board),
  playersStatus: createSelector([selectGame], (game) => game.playersStatus),
  score: createSelector([selectGame], (game) => game.score),
  isPlayerXTurn: createSelector([selectGame], (game) => game.isPlayerX),
  winCords: createSelector([selectGame], (game) => game.winCords),
});

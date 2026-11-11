import { Game } from '@civ-clone/core-game';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';

// What a barbarian leader's people pay for him, at every level (v474.05 `AttackActions.cs` 398–409).
export const RANSOM = 100;

export type RansomGame = Pick<Game, 'engine' | 'playerTreasuries'>;

/**
 * Pays `player` the ransom for the barbarian leader `leader` and says so (`barbarians:ransom`: player, leader, gold).
 * Whichever rule decides that a leader is ransomed pays through this, so the gold and the notice are the same: this
 * package's, and any that takes its place (civ-clone/web-renderer#954).
 */
export const payRansom = (
  game: RansomGame,
  player: Player,
  leader: Unit
): void => {
  game.playerTreasuries.getByPlayerAndType(player, Gold).add(RANSOM);

  game.engine.emit('barbarians:ransom', player, leader, RANSOM);
};

export default payRansom;

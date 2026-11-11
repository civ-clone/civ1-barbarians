import { Game } from '@civ-clone/core-game';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
export declare const RANSOM = 100;
export type RansomGame = Pick<Game, 'engine' | 'playerTreasuries'>;
/**
 * Pays `player` the ransom for the barbarian leader `leader` and says so (`barbarians:ransom`: player, leader, gold).
 * Whichever rule decides that a leader is ransomed pays through this, so the gold and the notice are the same: this
 * package's, and any that takes its place (civ-clone/web-renderer#954).
 */
export declare const payRansom: (
  game: RansomGame,
  player: Player,
  leader: Unit
) => void;
export default payRansom;

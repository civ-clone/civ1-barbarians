import base from '@civ-clone/base-barbarians/lib/ransom';
import type { RansomGame } from '@civ-clone/base-barbarians/lib/ransom';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';

// What a barbarian leader's people pay for him, at every level (v474.05 `AttackActions.cs` 398–409).
export const RANSOM = 100;

export type { RansomGame } from '@civ-clone/base-barbarians/lib/ransom';

/**
 * Pays `player` the ransom for the barbarian leader `leader` and says so (`barbarians:ransom`: player, leader, gold),
 * through base-barbarians' `payRansom`. Whichever rule decides that a leader is ransomed pays through this, so the gold
 * and the notice are the same: this package's, and any that takes its place (civ-clone/web-renderer#954).
 */
export const payRansom = (
  game: RansomGame,
  player: Player,
  leader: Unit
): void => base(game, player, leader, RANSOM);

export default payRansom;

import type { BarbarianPlayerGame } from '@civ-clone/base-barbarians/lib/barbarianPlayer';
import Player from '@civ-clone/core-player/Player';
import World from '@civ-clone/core-world/World';
export type { BarbarianPlayerGame } from '@civ-clone/base-barbarians/lib/barbarianPlayer';
export declare const STARTING_ADVANCES_RULE =
  'civ1-science:player/added/starting-advances';
/**
 * The barbarian player, made at the first spawn (civ-clone/web-renderer#169) by base-barbarians' `barbarianPlayer`, so
 * that a new game and an old save take the same path and nobody takes an empty turn before the barbarians are due.
 *
 * Its government is set to Anarchy, which it never leaves: no taxes, no science and no upkeep, and production as usual.
 * A revolution is never offered in Anarchy, and only a Democracy's civil disorder starts one. `civ1-science`'s starting
 * advances are held off while it is added.
 *
 * The spawn runs as a turn starts. When that turn's players are already queued (`civ1-player` queues them before the
 * `Start` rules run), the new player joins the end of the queue, so its first raiders move this turn, as v474.05's
 * do the turn after they appear; queued later, the queue already holds it.
 */
export declare const barbarianPlayer: (
  game: BarbarianPlayerGame,
  world: World
) => Player;
export default barbarianPlayer;

import { Game } from '@civ-clone/core-game';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Unit from '@civ-clone/core-unit/Unit';
export declare const PILLAGERS: (typeof Unit)[];
type PillageGame = Pick<Game, 'cities' | 'rules' | 'tileImprovements'>;
/**
 * Pillage (civ-clone/web-renderer#171, v474.05 `PlayerTurn.cs` 1739–1760): a barbarian Horseman, Chariot, Musketman
 * or Cannon leaving a square outside a city that has irrigation or a mine, whose nearest city is a civilization's,
 * destroys both, and stops. Through the `Pillaged` rules, so the square's yields are refreshed.
 */
export declare const getRules: (game: PillageGame) => Moved[];
export default getRules;

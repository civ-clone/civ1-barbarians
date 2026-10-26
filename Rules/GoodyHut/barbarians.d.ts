import { BarbarianPlayerGame } from '../../lib/barbarianPlayer';
import Barbarians from '@civ-clone/civ1-goody-hut/Rules/GoodyHut/Barbarians';
import { Game } from '@civ-clone/core-game';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
export type HordeGame = BarbarianPlayerGame & Pick<Game, 'cities' | 'units'>;
/**
 * Where a hut's horde stands (v474.05 OpenCiv1 `Segment_1866`, from 0x1c71): round the hut's neighbours from the north,
 * clockwise, stepping by `clamp(4 − cities, 1, 4)`. So up to 3, 4 or 8 units for a player with 1, 2, or 3 or more
 * cities. A square that isn't free is passed over, not replaced.
 */
export declare const hordeSquares: (
  hut: Tile,
  cities: number,
  free: (tile: Tile) => boolean
) => Tile[];
export declare const hordeUnit: (tile: Tile) => typeof Unit;
/** The horde a goody hut unleashes (civ-clone/web-renderer#172), on the empty, non-city land around it. */
export declare const getRules: (game: HordeGame) => Barbarians[];
export default getRules;

import { Horseman, Swordman } from '@civ-clone/civ1-unit/Units';
import barbarianPlayer, {
  BarbarianPlayerGame,
} from '../../lib/barbarianPlayer';
import Barbarians from '@civ-clone/civ1-goody-hut/Rules/GoodyHut/Barbarians';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import GoodyHut from '@civ-clone/core-goody-hut/GoodyHut';
import { Mountains } from '@civ-clone/civ1-world/Terrains';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import spawnUnits from '../../lib/spawnUnits';

export type HordeGame = BarbarianPlayerGame & Pick<Game, 'cities' | 'units'>;

/**
 * Where a hut's horde stands (v474.05 OpenCiv1 `Segment_1866`, from 0x1c71): round the hut's neighbours from the north,
 * clockwise, stepping by `clamp(4 − cities, 1, 4)`. So up to 3, 4 or 8 units for a player with 1, 2, or 3 or more
 * cities. A square that isn't free is passed over, not replaced.
 */
export const hordeSquares = (
  hut: Tile,
  cities: number,
  free: (tile: Tile) => boolean
): Tile[] => {
  const step = Math.min(Math.max(4 - cities, 1), 4);

  return hut
    .getNeighbours()
    .filter((tile: Tile, index: number): boolean => index % step === 0)
    .filter(free);
};

// Each a Horseman (v474.05's Cavalry), or a Swordman (its Legion) on Mountains.
export const hordeUnit = (tile: Tile): typeof Unit =>
  tile.terrain() instanceof Mountains ? Swordman : Horseman;

/** The horde a goody hut unleashes (civ-clone/web-renderer#172), on the empty, non-city land around it. */
export const getRules = (game: HordeGame): Barbarians[] => [
  new Barbarians(
    'civ1-barbarians:goody-hut/barbarians/horde',
    new Effect((goodyHut: GoodyHut, unit: Unit): void => {
      const squares = hordeSquares(
        goodyHut.tile(),
        game.cities.getByPlayer(unit.player()).length,
        (tile: Tile): boolean =>
          tile.isLand() &&
          game.cities.getByTile(tile) === null &&
          game.units.getByTile(tile).length === 0
      );

      if (squares.length === 0) {
        return;
      }

      const player = barbarianPlayer(game, goodyHut.tile().map());

      squares.forEach((tile: Tile): void => {
        spawnUnits(player, tile, [hordeUnit(tile)], game.rules);
      });
    })
  ),
];

export default getRules;

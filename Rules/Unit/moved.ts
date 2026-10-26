import {
  Cannon,
  Chariot,
  Horseman,
  Musketman,
} from '@civ-clone/civ1-unit/Units';
import { Irrigation, Mine } from '@civ-clone/civ1-world/TileImprovements';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Pillaged from '@civ-clone/core-tile-improvement/Rules/Pillaged';
import Tile from '@civ-clone/core-world/Tile';
import TileImprovement from '@civ-clone/core-tile-improvement/TileImprovement';
import Unit from '@civ-clone/core-unit/Unit';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

// The barbarians that wreck farms and mines on their way: not Swordmen or Knights, the raiders that come by sea.
export const PILLAGERS: (typeof Unit)[] = [
  Horseman,
  Chariot,
  Musketman,
  Cannon,
];

type PillageGame = Pick<Game, 'cities' | 'rules' | 'tileImprovements'>;

// Where a move started: every move action has one, and an action that isn't a move has none.
const from = (action: Action): Tile | null =>
  typeof (action as unknown as { from?: () => Tile }).from === 'function'
    ? (action as unknown as { from: () => Tile }).from()
    : null;

const wreckable = (tile: Tile, game: PillageGame): TileImprovement[] =>
  game.tileImprovements
    .getByTile(tile)
    .filter(
      (improvement: TileImprovement): boolean =>
        improvement instanceof Irrigation || improvement instanceof Mine
    );

const nearestCity = (tile: Tile, game: PillageGame): City | null =>
  game.cities
    .entries()
    .filter((city: City): boolean => !city.destroyed())
    .reduce(
      (nearest: City | null, city: City): City | null =>
        nearest === null ||
        tile.distanceFrom(city.tile()) < tile.distanceFrom(nearest.tile())
          ? city
          : nearest,
      null
    );

/**
 * Pillage (civ-clone/web-renderer#171, v474.05 `PlayerTurn.cs` 1739–1760): a barbarian Horseman, Chariot, Musketman
 * or Cannon leaving a square outside a city that has irrigation or a mine, whose nearest city is a civilization's,
 * destroys both, and stops. Through the `Pillaged` rules, so the square's yields are refreshed.
 */
export const getRules = (game: PillageGame): Moved[] => [
  new Moved(
    'civ1-barbarians:unit/moved/pillage',
    new Criterion((unit: Unit): boolean => isBarbarian(unit.player())),
    new Criterion((unit: Unit): boolean =>
      PILLAGERS.some(
        (UnitType: typeof Unit): boolean => unit instanceof UnitType
      )
    ),
    new Criterion((unit: Unit, action: Action): boolean => {
      const tile = from(action);

      // Left it: an attack that didn't move the unit passes through here too.
      return (
        tile !== null &&
        tile !== unit.tile() &&
        game.cities.getByTile(tile) === null &&
        wreckable(tile, game).length > 0
      );
    }),
    new Criterion((unit: Unit, action: Action): boolean => {
      const city = nearestCity(from(action) as Tile, game);

      return city !== null && !isBarbarian(city.player());
    }),
    new Effect((unit: Unit, action: Action): void => {
      const tile = from(action) as Tile;

      wreckable(tile, game).forEach((improvement: TileImprovement): void => {
        game.rules.process(Pillaged, tile, improvement);
      });

      unit.moves().set(0);
    })
  ),
];

export default getRules;

import {
  Cannon,
  Chariot,
  Diplomat,
  Frigate,
  Horseman,
  Knight,
  Musketman,
  Sail,
  Swordman,
} from '@civ-clone/civ1-unit/Units';
import barbarianPlayer, {
  BarbarianPlayerGame,
} from '../../lib/barbarianPlayer';
import spawnUnits, { createUnit } from '../../lib/spawnUnits';
import Automobile from '@civ-clone/base-science-advance-automobile/Automobile';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Explosives from '@civ-clone/base-science-advance-explosives/Explosives';
import { Game } from '@civ-clone/core-game';
import Industrialization from '@civ-clone/base-science-advance-industrialization/Industrialization';
import NavalTransport from '@civ-clone/base-unit-type-naval-transport/NavalTransport';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import anyoneHas from '../../lib/anyoneHas';
import cityGold from '../../lib/cityGold';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import { polarRows } from '../../lib/polar';
import spawning from '../../lib/spawning';
import waterBodyHasAtLeast from '../../lib/waterBody';
import worldOf from '../../lib/worldOf';

export type BarbariansGame = BarbarianPlayerGame &
  Pick<
    Game,
    | 'cities'
    | 'cityGrowth'
    | 'landMasses'
    | 'playerResearch'
    | 'playerTreasuries'
    | 'units'
  >;

// A raiding ship appears no nearer than this many of v474.05's 50 rows to either edge of the map.
export const SEA_POLAR_ROWS = 3;

// The squares a raiding party's ship, and an uprising, are sized by.
export const raidersAtSea = (turnCount: number): number =>
  Math.min(Math.max(Math.floor(turnCount / 150) + 1, 1), 3);

export const uprisingSize = (citySize: number, roll: number): number =>
  Math.min(Math.max(Math.floor(roll * Math.floor(citySize / 2)), 2), 99) + 1;

// Horsemen and Chariots in blocks of four (Musketmen and Cannon once anyone has Industrialization), the last a Diplomat:
//  the leader of the uprising.
export const uprisingUnits = (
  count: number,
  industrial: boolean
): (typeof Unit)[] =>
  new Array(count).fill(null).map((_, i: number): typeof Unit => {
    if (i === count - 1) {
      return Diplomat;
    }

    if (industrial) {
      return (i & 4) === 0 ? Musketman : Cannon;
    }

    return (i & 4) === 0 ? Horseman : Chariot;
  });

const nearestCity = (tile: Tile, cities: City[]): City =>
  cities.reduce(
    (nearest: City, city: City): City =>
      tile.distanceFrom(city.tile()) < tile.distanceFrom(nearest.tile())
        ? city
        : nearest,
    cities[0]
  );

/**
 * When barbarians appear, once every player has moved in v474.05 (`GameEngine.cs` `F0_1238_0980`), at the start of
 * the turn here, with the barbarians first to move. Each rule's gate is every `Spawning` rule (`Rules/Turn/spawning`:
 * turn (5 − level) × 30). The barbarian player is made by the first spawn.
 */
export const getRules = (game: BarbariansGame): Start[] => [
  // Every 8th turn, until anyone has Automobile, a Sail (a Frigate from turn 300) appears on an empty square of a sea
  //  of at least 16 squares, clear of the poles, carrying 1 to 3 Swordmen (Knights once anyone has Explosives) and a
  //  Diplomat. Where it goes is the barbarian client's business.
  new Start(
    'civ1-barbarians:turn/start/sea-landing',
    new Criterion((turn: Turn): boolean => spawning(game.rules, turn)),
    // `(turnCount + 1) % 8 === 0`, with `turnCount` being `turn.value() - 1`.
    new Criterion((turn: Turn): boolean => turn.value() % 8 === 0),
    new Criterion((): boolean => !anyoneHas(game.playerResearch, Automobile)),
    new Effect((turn: Turn): void => {
      const world = worldOf(game);

      if (world === null) {
        return;
      }

      const height = world.height(),
        margin = polarRows(height, SEA_POLAR_ROWS),
        candidates = world
          .entries()
          .filter(
            (tile: Tile): boolean =>
              tile.isWater() &&
              tile.y() >= margin &&
              tile.y() < height - margin &&
              game.units.getByTile(tile).length === 0
          );

      let tile: Tile | null = null;

      // v474.05 draws squares until one will do; a world with little open sea gives up after a while instead.
      for (let tries = 0; tries < 100 && candidates.length > 0; tries++) {
        const candidate =
          candidates[Math.floor(game.rng() * candidates.length)];

        if (waterBodyHasAtLeast(candidate, 16)) {
          tile = candidate;

          break;
        }
      }

      if (tile === null) {
        return;
      }

      const raiders = raidersAtSea(turn.value() - 1),
        player = barbarianPlayer(game, world),
        ship = createUnit(
          (raiders < 3 ? Sail : Frigate) as unknown as typeof Unit,
          player,
          tile,
          game.rules
        ) as unknown as NavalTransport,
        Raider = anyoneHas(game.playerResearch, Explosives) ? Knight : Swordman;

      spawnUnits(
        player,
        tile,
        [...new Array(raiders).fill(Raider), Diplomat],
        game.rules,
        ship
      );

      game.engine.emit('barbarians:raiders-at-sea', player, ship, tile);
    })
  ),

  // Each turn one of 128 city slots is drawn, as v474.05 does; an occupied one may rise with a chance of its gold in
  //  100. Any civilization's city, not only the human's (civ-clone/web-renderer#27). The square is found by up to 99
  //  tries within 6 of the city, each re-centred on the city nearest the last try: empty land on that city's land mass,
  //  at least 6 from it, with no civilization's unit next to it. The group is sized by that city.
  new Start(
    'civ1-barbarians:turn/start/land-uprising',
    new Criterion((turn: Turn): boolean => spawning(game.rules, turn)),
    new Effect((): void => {
      const cities = game.cities
          .entries()
          .filter(
            (city: City): boolean =>
              !city.destroyed() && !isBarbarian(city.player())
          ),
        slot = Math.floor(game.rng() * 128);

      if (slot >= cities.length) {
        return;
      }

      const city = cities[slot];

      if (Math.floor(game.rng() * 100) >= cityGold(city, game)) {
        return;
      }

      const world = city.tile().map(),
        allCities = game.cities
          .entries()
          .filter((city: City): boolean => !city.destroyed());

      let target = city,
        tile: Tile | null = null;

      for (let tries = 0; tries < 99; tries++) {
        const centre = target.tile(),
          x = centre.x() + Math.floor(game.rng() * 13) - 6,
          y = centre.y() + Math.floor(game.rng() * 13) - 6;

        if (y < 0 || y >= world.height()) {
          continue;
        }

        const candidate = world.get(x, y);

        target = nearestCity(candidate, allCities);

        if (
          candidate.distanceFrom(target.tile()) < 6 ||
          !candidate.isLand() ||
          game.units.getByTile(candidate).length > 0 ||
          game.landMasses.getByTile(candidate) !==
            game.landMasses.getByTile(target.tile()) ||
          candidate
            .getNeighbours()
            .some(
              (neighbour: Tile): boolean =>
                neighbour.isLand() &&
                game.units
                  .getByTile(neighbour)
                  .some((unit: Unit): boolean => !isBarbarian(unit.player()))
            )
        ) {
          continue;
        }

        tile = candidate;

        break;
      }

      if (tile === null) {
        return;
      }

      const count = uprisingSize(
          game.cityGrowth.getByCity(target).size(),
          game.rng()
        ),
        industrial = anyoneHas(game.playerResearch, Industrialization),
        player = barbarianPlayer(game, world);

      spawnUnits(player, tile, uprisingUnits(count, industrial), game.rules);

      game.engine.emit('barbarians:uprising', player, target, tile, industrial);
    })
  ),
];

export default getRules;

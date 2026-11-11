import {
  Cannon,
  Chariot,
  Diplomat,
  Horseman,
  Musketman,
} from '@civ-clone/civ1-unit/Units';
import barbarianPlayer, { BarbarianPlayerGame } from './barbarianPlayer';
import City from '@civ-clone/core-city/City';
import { Game } from '@civ-clone/core-game';
import Industrialization from '@civ-clone/base-science-advance-industrialization/Industrialization';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import anyoneHas from './anyoneHas';
import cityGold from './cityGold';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import spawnUnits from './spawnUnits';

export type LandUprisingGame = BarbarianPlayerGame &
  Pick<
    Game,
    | 'cities'
    | 'cityGrowth'
    | 'landMasses'
    | 'playerResearch'
    | 'playerTreasuries'
    | 'units'
  >;

// How many rise: max(⌊size ÷ 2 random⌋, 2) + 1.
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
 * A turn's chance of an uprising on land, as v474.05's (civd `TURN.C` `uprising()`): one of 128 city slots is drawn,
 * and a city there that `rises` may rise with a chance of its gold in 100. The square is found by up to 99 tries within
 * 6 of the city, each re-centred on the city nearest the last try: empty land on that city's land mass, at least 6 from
 * it, with no civilization's unit next to it. The group is sized by that city. Which cities may rise is the rule's:
 * whichever rule raises an uprising does so through this, so the units and `barbarians:uprising` are the same
 * (civ-clone/web-renderer#954).
 */
export const landUprising = (
  game: LandUprisingGame,
  rises: (city: City) => boolean
): void => {
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

  if (!rises(city)) {
    return;
  }

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
};

export default landUprising;

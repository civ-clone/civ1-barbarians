import Captured from '@civ-clone/core-city/Rules/Captured';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import Low from '@civ-clone/core-rule/Priorities/Low';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

// Barbarians whose attack is no more than this burn a city rather than take it: Horsemen and Musketmen.
export const BURNS_AT_ATTACK = 2;

// The barbarians' strongest attack on a city's square: the unit that took it, as `CaptureCity` doesn't say which.
const strongestAttack = (
  city: City,
  player: Player,
  units: Game['units']
): number =>
  Math.max(
    ...units
      .getByTile(city.tile())
      .filter((unit: Unit): boolean => unit.player() === player)
      .map((unit: Unit): number => unit.attack().value())
  );

/**
 * Barbarians too weak to hold a city burn it (civ-clone/web-renderer#171, v474.05 `Actions.cs` 21–78): taken by a
 * Horseman or a Musketman, it is destroyed; by anything stronger, it is captured as usual. Low priority, so it is
 * destroyed once the usual capture has run: run before, `civ1-city`'s shrink would destroy a size-1 city a second time.
 */
export const getRules = (game: Pick<Game, 'units'>): Captured[] => [
  new Captured(
    'civ1-barbarians:city/captured/burn',
    new Low(),
    new Criterion((city: City, capturingPlayer: Player): boolean =>
      isBarbarian(capturingPlayer)
    ),
    new Criterion((city: City): boolean => !city.destroyed()),
    new Criterion(
      (city: City, capturingPlayer: Player): boolean =>
        strongestAttack(city, capturingPlayer, game.units) <= BURNS_AT_ATTACK
    ),
    new Effect((city: City, capturingPlayer: Player): void =>
      city.destroy(capturingPlayer)
    )
  ),
];

export default getRules;

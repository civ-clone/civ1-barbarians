import {
  Diplomat,
  Frigate,
  Knight,
  Sail,
  Swordman,
} from '@civ-clone/civ1-unit/Units';
import barbarianPlayer, {
  BarbarianPlayerGame,
} from '../../lib/barbarianPlayer';
import spawnUnits, { createUnit } from '../../lib/spawnUnits';
import landUprising, { LandUprisingGame } from '../../lib/landUprising';
import Automobile from '@civ-clone/base-science-advance-automobile/Automobile';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Explosives from '@civ-clone/base-science-advance-explosives/Explosives';
import { Game } from '@civ-clone/core-game';
import NavalTransport from '@civ-clone/base-unit-type-naval-transport/NavalTransport';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import { LAND_UPRISING_RULE } from '../../RuleIds';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import anyoneHas from '../../lib/anyoneHas';
import isHuman from '@civ-clone/civ1-difficulty/isHuman';
import { polarRows } from '../../lib/polar';
import { turnCount } from './spawning';
import spawning from '../../lib/spawning';
import waterBodyHasAtLeast from '../../lib/waterBody';
import worldOf from '../../lib/worldOf';

export type BarbariansGame = BarbarianPlayerGame &
  LandUprisingGame &
  Pick<Game, 'clients'>;

// A raiding ship appears no nearer than this many of v474.05's 50 rows to either edge of the map.
export const SEA_POLAR_ROWS = 3;

// The squares a raiding party's ship, and an uprising, are sized by.
export const raidersAtSea = (turnCount: number): number =>
  Math.min(Math.max(Math.floor(turnCount / 150) + 1, 1), 3);

export { uprisingSize, uprisingUnits } from '../../lib/landUprising';

/**
 * When barbarians appear, once every player has moved in v474.05 (`GameEngine.cs` `F0_1238_0980`), at the start of
 * the next turn here (`turnCount`), with the barbarians first to move. Each rule's gate is every `Spawning` rule
 * (`Rules/Turn/spawning`: turn (5 − level) × 30). The barbarian player is made by the first spawn.
 */
export const getRules = (game: BarbariansGame): Start[] => [
  // Every 8th turn, until anyone has Automobile, a Sail (a Frigate from turn 300) appears on an empty square of a sea
  //  of at least 16 squares, clear of the poles, carrying 1 to 3 Swordmen (Knights once anyone has Explosives) and a
  //  Diplomat. Where it goes is the barbarian client's business.
  new Start(
    'civ1-barbarians:turn/start/sea-landing',
    new Criterion((turn: Turn): boolean => spawning(game.rules, turn)),
    // v474.05's `(turnCount + 1) % 8 === 0`.
    new Criterion((turn: Turn): boolean => (turnCount(turn) + 1) % 8 === 0),
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

      const raiders = raidersAtSea(turnCount(turn)),
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

  // Each turn one of 128 city slots is drawn, as v474.05 does, and a city there may rise (`lib/landUprising`). As
  //  v474.05, only the human's city (civd `TURN.C` `uprising()`, civ-clone/web-renderer#954):
  //
  //      i = rand_scaled(128);
  //      if (townbuf[i].status == -1 || townbuf[i].owner != civnow)
  //          return;
  //
  //  The square is found near it, re-centred on the city nearest each try, so the uprising may be nearer another
  //  civilization's city, and is sized by that one. `civ1-enhanced` lets any civilization's city rise
  //  (civ-clone/web-renderer#27), taking this rule's place while its set is on.
  new Start(
    LAND_UPRISING_RULE,
    new Criterion((turn: Turn): boolean => spawning(game.rules, turn)),
    new Effect((): void =>
      landUprising(game, (city: City): boolean =>
        isHuman(city.player(), game.clients)
      )
    )
  ),
];

export default getRules;

import Criterion from '@civ-clone/core-rule/Criterion';
import Destroyed from '@civ-clone/core-unit/Rules/Destroyed';
import { Diplomat } from '@civ-clone/civ1-unit/Units';
import Effect from '@civ-clone/core-rule/Effect';
import { Game } from '@civ-clone/core-game';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

// What a barbarian leader's people pay for him, at every level (v474.05 `AttackActions.cs` 398–409).
export const RANSOM = 100;

/**
 * Ransom (civ-clone/web-renderer#171): a barbarian leader (the group's Diplomat) killed by a civilization pays it 100
 * gold. On `Destroyed` rather than `Defeated`, so a leader killed in a stack pays too: the units dying with a defender
 * are only destroyed. Dom, 2026-10-23, against v474.05, where only a lone leader pays. Disbanding passes no player,
 * so a leader who gives up pays nothing.
 */
export const getRules = (
  game: Pick<Game, 'engine' | 'playerTreasuries'>
): Destroyed[] => [
  new Destroyed(
    'civ1-barbarians:unit/destroyed/ransom',
    new Criterion(
      (unit: Unit): boolean =>
        unit instanceof Diplomat && isBarbarian(unit.player())
    ),
    new Criterion(
      (unit: Unit, player: Player | null): boolean =>
        player !== null && !isBarbarian(player)
    ),
    new Effect((unit: Unit, player: Player | null): void => {
      game.playerTreasuries
        .getByPlayerAndType(player as Player, Gold)
        .add(RANSOM);

      game.engine.emit('barbarians:ransom', player, unit, RANSOM);
    })
  ),
];

export default getRules;

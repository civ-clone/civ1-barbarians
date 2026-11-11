import Action from '@civ-clone/core-unit/Action';
import Criterion from '@civ-clone/core-rule/Criterion';
import Defeated from '@civ-clone/core-unit/Rules/Defeated';
import { Diplomat } from '@civ-clone/civ1-unit/Units';
import Effect from '@civ-clone/core-rule/Effect';
import Unit from '@civ-clone/core-unit/Unit';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import payRansom, { RansomGame } from '../../lib/ransom';

/**
 * Ransom (civ-clone/web-renderer#171): a barbarian leader (the group's Diplomat) who defends and loses pays the
 * civilization that beat him 100 gold. As v474.05 (`BATTLE.C` `battle()`): only the unit that defended is looked at,
 * so a leader killed in a stack that another unit defended pays nothing, a leader who defends his stack pays, and a
 * leader who attacks and loses pays nothing (civ-clone/web-renderer#954). `civ1-enhanced` has a rule that pays for a
 * leader killed in a stack too, and takes this one's place while it is in force.
 */
export const getRules = (game: RansomGame): Defeated[] => [
  new Defeated(
    'civ1-barbarians:unit/defeated/ransom',
    // `Attack` processes `Defeated` for a losing attacker too: the action's unit is the one that attacked.
    new Criterion(
      (unit: Unit, by: Unit, action?: Action): boolean =>
        !action || action.unit() !== unit
    ),
    new Criterion(
      (unit: Unit): boolean =>
        unit instanceof Diplomat && isBarbarian(unit.player())
    ),
    new Criterion((unit: Unit, by: Unit): boolean => !isBarbarian(by.player())),
    new Effect((unit: Unit, by: Unit): void =>
      payRansom(game, by.player(), unit)
    )
  ),
];

export default getRules;

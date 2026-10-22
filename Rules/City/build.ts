import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import { Caravan, Diplomat, Settlers } from '@civ-clone/civ1-unit/Units';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Attack from '@civ-clone/core-unit/Yields/Attack';
import { BaseYield } from '@civ-clone/core-unit/Rules/Yield';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import { requiredAdvanceFor } from '@civ-clone/civ1-unit/lib/requiredAdvances';

// How many civilizations must be able to build a unit before a barbarian city can.
export const CIVILIZATIONS_NEEDED = 2;

// A unit type's attack before anything modifies it, by the ruleset's `BaseYield` rules.
const baseAttack = (
  UnitType: typeof Unit,
  ruleRegistry: RuleRegistry
): number => {
  const attack = new Attack();

  ruleRegistry.process(BaseYield, UnitType, attack);

  return attack.value();
};

/**
 * Whether a barbarian city may build `Item`: a unit that attacks, other than Settlers, a Diplomat or a Caravan, that
 * at least two civilizations know how to build (civ-clone/web-renderer#27, decision 3). Never an improvement or a
 * Wonder. v474.05's barbarian cities build Legions, then Knights.
 */
export const availableToBarbarians = (
  Item: IConstructor,
  playerRegistry: Pick<PlayerRegistry, 'entries'>,
  playerResearchRegistry: Pick<PlayerResearchRegistry, 'getByPlayer'>,
  ruleRegistry: RuleRegistry
): boolean => {
  if (!Object.prototype.isPrototypeOf.call(Unit, Item)) {
    return false;
  }

  const UnitType = Item as unknown as typeof Unit;

  if (
    UnitType === Settlers ||
    UnitType === Diplomat ||
    UnitType === Caravan ||
    baseAttack(UnitType, ruleRegistry) <= 0
  ) {
    return false;
  }

  const RequiredAdvance = requiredAdvanceFor(UnitType);

  if (RequiredAdvance === null) {
    return true;
  }

  return (
    playerRegistry
      .entries()
      .filter(
        (player: Player): boolean =>
          !isBarbarian(player) &&
          playerResearchRegistry.getByPlayer(player).completed(RequiredAdvance)
      ).length >= CIVILIZATIONS_NEEDED
  );
};

export const getRules = (
  playerRegistry: PlayerRegistry,
  playerResearchRegistry: PlayerResearchRegistry,
  ruleRegistry: RuleRegistry
): Build[] => [
  new Build(
    'civ1-barbarians:city/build/raiders-only',
    new Criterion((city: City): boolean => isBarbarian(city.player())),
    new Effect(
      (city: City, Item: IConstructor): IBuildCriterion =>
        new Criterion((): boolean =>
          availableToBarbarians(
            Item,
            playerRegistry,
            playerResearchRegistry,
            ruleRegistry
          )
        )
    )
  ),
];

export default getRules;

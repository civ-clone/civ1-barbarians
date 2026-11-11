import { Build, IBuildCriterion } from '@civ-clone/core-city-build/Rules/Build';
import { Knight, Swordman, Warrior } from '@civ-clone/civ1-unit/Units';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Explosives from '@civ-clone/base-science-advance-explosives/Explosives';
import { IConstructor } from '@civ-clone/core-registry/Registry';
import Player from '@civ-clone/core-player/Player';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RAIDERS_ONLY_RULE } from '../../RuleIds';
import Unit from '@civ-clone/core-unit/Unit';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import anyoneHas from '../../lib/anyoneHas';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

/**
 * The one unit a barbarian city builds, as v474.05 chooses it (civd `ECONOMY.C` `find_slot()`, civ-clone/web-renderer#954):
 * a Warrior (`UTYPE_MILITIA`) while the barbarians have no unit anywhere, then a Swordman (`UTYPE_LEGION`) until anyone
 * has Explosives (advance 56), and a Knight (`UTYPE_KNIGHTS`) after:
 *
 *     if (troops_total[civ] == 0 && civ != civnow && civ_gov[civ] <= 1)
 *         return 1;
 *     if (civ == 0) {
 *         if (!(advance_owners[56] & 7))
 *             return 3;
 *         return 7;
 *     }
 *
 * The barbarians' government is Anarchy for good, so `civ_gov[civ] <= 1` always holds. Their cities never build an
 * improvement, a Wonder or any other unit, and need no advance for these.
 */
export const barbarianUnit = (
  barbarians: Player,
  playerResearchRegistry: PlayerResearchRegistry,
  unitRegistry: UnitRegistry
): typeof Unit => {
  if (unitRegistry.getByPlayer(barbarians).length === 0) {
    return Warrior;
  }

  return anyoneHas(playerResearchRegistry, Explosives) ? Knight : Swordman;
};

/**
 * What a barbarian city may build: `barbarianUnit`, and nothing else. `civ1-unit`'s advance rules leave barbarian
 * cities to this one. `civ1-enhanced` lets them build any attacking land unit two civilizations can build
 * (civ-clone/web-renderer#27), taking this rule's place while its set is on.
 */
export const getRules = (
  playerResearchRegistry: PlayerResearchRegistry,
  unitRegistry: UnitRegistry
): Build[] => [
  new Build(
    RAIDERS_ONLY_RULE,
    new Criterion((city: City): boolean => isBarbarian(city.player())),
    new Effect(
      (city: City, Item: IConstructor): IBuildCriterion =>
        new Criterion(
          (): boolean =>
            Item ===
            (barbarianUnit(
              city.player(),
              playerResearchRegistry,
              unitRegistry
            ) as unknown as IConstructor)
        )
    )
  ),
];

export default getRules;

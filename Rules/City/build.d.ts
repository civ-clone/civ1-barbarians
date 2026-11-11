import { Build } from '@civ-clone/core-city-build/Rules/Build';
import Player from '@civ-clone/core-player/Player';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
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
export declare const barbarianUnit: (
  barbarians: Player,
  playerResearchRegistry: PlayerResearchRegistry,
  unitRegistry: UnitRegistry
) => typeof Unit;
/**
 * What a barbarian city may build: `barbarianUnit`, and nothing else. `civ1-unit`'s advance rules leave barbarian
 * cities to this one. `civ1-enhanced` lets them build any attacking land unit two civilizations can build
 * (civ-clone/web-renderer#27), taking this rule's place while its set is on.
 */
export declare const getRules: (
  playerResearchRegistry: PlayerResearchRegistry,
  unitRegistry: UnitRegistry
) => Build[];
export default getRules;

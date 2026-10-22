import { Build } from '@civ-clone/core-city-build/Rules/Build';
import { PlayerRegistry } from '@civ-clone/core-player/PlayerRegistry';
import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { IConstructor } from '@civ-clone/core-registry/Registry';
export declare const CIVILIZATIONS_NEEDED = 2;
/**
 * Whether a barbarian city may build `Item`: a land unit that attacks, other than Settlers, a Diplomat or a Caravan,
 * that at least two civilizations know how to build (civ-clone/web-renderer#27, decision 3). Never a ship, an
 * aircraft or a missile (the barbarians' client moves land units and transports only), an improvement or a Wonder.
 * v474.05's barbarian cities build Legions, then Knights.
 */
export declare const availableToBarbarians: (
  Item: IConstructor,
  playerRegistry: Pick<PlayerRegistry, 'entries'>,
  playerResearchRegistry: Pick<PlayerResearchRegistry, 'getByPlayer'>,
  ruleRegistry: RuleRegistry
) => boolean;
export declare const getRules: (
  playerRegistry: PlayerRegistry,
  playerResearchRegistry: PlayerResearchRegistry,
  ruleRegistry: RuleRegistry
) => Build[];
export default getRules;

import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
export declare const anyoneHas: (
  playerResearchRegistry: PlayerResearchRegistry,
  AdvanceType: typeof Advance
) => boolean;
export default anyoneHas;

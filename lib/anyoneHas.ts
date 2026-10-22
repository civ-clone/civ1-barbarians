import { PlayerResearchRegistry } from '@civ-clone/core-science/PlayerResearchRegistry';
import Advance from '@civ-clone/core-science/Advance';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';

// Whether any player, in the game or gone, has `AdvanceType`: v474.05 keeps who discovered each advance first, and
//  the barbarians' ships, raiders and uprisings follow the world's progress rather than any one civilization's.
export const anyoneHas = (
  playerResearchRegistry: PlayerResearchRegistry,
  AdvanceType: typeof Advance
): boolean =>
  playerResearchRegistry.some((playerResearch: PlayerResearch): boolean =>
    playerResearch.completed(AdvanceType)
  );

export default anyoneHas;

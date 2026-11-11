import { BarbarianPlayerGame } from '../../lib/barbarianPlayer';
import { LandUprisingGame } from '../../lib/landUprising';
import { Game } from '@civ-clone/core-game';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
export type BarbariansGame = BarbarianPlayerGame &
  LandUprisingGame &
  Pick<Game, 'clients'>;
export declare const SEA_POLAR_ROWS = 3;
export declare const raidersAtSea: (turnCount: number) => number;
export { uprisingSize, uprisingUnits } from '../../lib/landUprising';
/**
 * When barbarians appear, once every player has moved in v474.05 (`GameEngine.cs` `F0_1238_0980`), at the start of
 * the next turn here (`turnCount`), with the barbarians first to move. Each rule's gate is every `Spawning` rule
 * (`Rules/Turn/spawning`: turn (5 − level) × 30). The barbarian player is made by the first spawn.
 */
export declare const getRules: (game: BarbariansGame) => Start[];
export default getRules;

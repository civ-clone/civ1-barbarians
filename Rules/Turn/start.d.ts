import { BarbarianPlayerGame } from '../../lib/barbarianPlayer';
import { Game } from '@civ-clone/core-game';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Unit from '@civ-clone/core-unit/Unit';
export type BarbariansGame = BarbarianPlayerGame &
  Pick<
    Game,
    | 'cities'
    | 'cityGrowth'
    | 'landMasses'
    | 'playerResearch'
    | 'playerTreasuries'
    | 'units'
  >;
export declare const SEA_POLAR_ROWS = 3;
export declare const raidersAtSea: (turnCount: number) => number;
export declare const uprisingSize: (citySize: number, roll: number) => number;
export declare const uprisingUnits: (
  count: number,
  industrial: boolean
) => (typeof Unit)[];
/**
 * When barbarians appear, once every player has moved in v474.05 (`GameEngine.cs` `F0_1238_0980`), at the start of
 * the turn here, with the barbarians first to move. Each rule's gate is every `Spawning` rule (`Rules/Turn/spawning`:
 * turn (5 − level) × 30). The barbarian player is made by the first spawn.
 */
export declare const getRules: (game: BarbariansGame) => Start[];
export default getRules;

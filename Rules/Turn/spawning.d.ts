import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import Spawning from '../Spawning';
import Turn from '@civ-clone/core-turn-based-game/Turn';
export declare const firstSpawnTurn: (level: number) => number;
export declare const turnCount: (turn: Turn) => number;
export declare const getRules: (
  gameDifficultyRegistry: GameDifficultyRegistry
) => Spawning[];
export default getRules;

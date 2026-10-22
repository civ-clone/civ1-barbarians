import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import Spawning from '../Spawning';
export declare const firstSpawnTurn: (level: number) => number;
export declare const getRules: (
  gameDifficultyRegistry: GameDifficultyRegistry
) => Spawning[];
export default getRules;

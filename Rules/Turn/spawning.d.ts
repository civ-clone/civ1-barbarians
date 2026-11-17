import { BarbarianActivity } from '../../lib/activity';
import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Spawning from '../Spawning';
import Turn from '@civ-clone/core-turn-based-game/Turn';
export declare const firstSpawnTurn: (level: number) => number;
/**
 * The first turn at an activity level (`lib/activity`): (5 − level) × its onset, which is `firstSpawnTurn` at v474.05's
 *  30. `Infinity` when it has none.
 */
export declare const firstSpawnTurnAt: (
  level: number,
  activity: BarbarianActivity
) => number;
export declare const turnCount: (turn: Turn) => number;
/**
 * The gate. Read at the level the game's `Activity` rules give (`lib/activity`), v474.05's when there are none, so
 *  `ruleRegistry` is the game's: with none given, v474.05's.
 */
export declare const getRules: (
  gameDifficultyRegistry: GameDifficultyRegistry,
  ruleRegistry?: RuleRegistry | null
) => Spawning[];
export default getRules;

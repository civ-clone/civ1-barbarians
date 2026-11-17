import {
  BarbarianActivity,
  CLASSIC_ACTIVITY,
  activityOf,
} from '../../lib/activity';
import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Spawning from '../Spawning';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import { levelOf } from '@civ-clone/civ1-difficulty/level';

// The first turn, in v474.05's count (0 at 4000 BC), on which barbarians may appear: 150 on Chieftain, 30 fewer for
//  each level up, to 30 on Emperor (`GameEngine.cs` `F0_1238_0980`).
export const firstSpawnTurn = (level: number): number => (5 - level) * 30;

/**
 * The first turn at an activity level (`lib/activity`): (5 − level) × its onset, which is `firstSpawnTurn` at v474.05's
 *  30. `Infinity` when it has none.
 */
export const firstSpawnTurnAt = (
  level: number,
  activity: BarbarianActivity
): number =>
  activity.onset === Infinity ? Infinity : (5 - level) * activity.onset;

// v474.05 spawns barbarians once everyone has moved in its count C, and they first move in C + 1. The `Start` rules
//  run as our turn V begins, which plays count V − 1, so the count just completed, the one v474.05 tests, is V − 2.
export const turnCount = (turn: Turn): number => turn.value() - 2;

/**
 * The gate. Read at the level the game's `Activity` rules give (`lib/activity`), v474.05's when there are none, so
 *  `ruleRegistry` is the game's: with none given, v474.05's.
 */
export const getRules = (
  gameDifficultyRegistry: GameDifficultyRegistry,
  ruleRegistry: RuleRegistry | null = null
): Spawning[] => [
  new Spawning(
    'civ1-barbarians:spawning/from-turn',
    new Effect(
      (turn: Turn): boolean =>
        turnCount(turn) >=
        firstSpawnTurnAt(
          levelOf(gameDifficultyRegistry),
          ruleRegistry === null ? CLASSIC_ACTIVITY : activityOf(ruleRegistry)
        )
    )
  ),
];

export default getRules;

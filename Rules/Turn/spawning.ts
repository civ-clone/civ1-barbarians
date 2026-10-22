import { GameDifficultyRegistry } from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Spawning from '../Spawning';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import { levelOf } from '@civ-clone/civ1-difficulty/level';

// The first turn, in v474.05's count (0 at 4000 BC), on which barbarians may appear: 150 on Chieftain, 30 fewer for
//  each level up, to 30 on Emperor (`GameEngine.cs` `F0_1238_0980`).
export const firstSpawnTurn = (level: number): number => (5 - level) * 30;

export const getRules = (
  gameDifficultyRegistry: GameDifficultyRegistry
): Spawning[] => [
  new Spawning(
    'civ1-barbarians:spawning/from-turn',
    new Effect(
      (turn: Turn): boolean =>
        turn.value() - 1 >= firstSpawnTurn(levelOf(gameDifficultyRegistry))
    )
  ),
];

export default getRules;

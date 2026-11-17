"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.turnCount = exports.firstSpawnTurnAt = exports.firstSpawnTurn = void 0;
const activity_1 = require("../../lib/activity");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Spawning_1 = require("../Spawning");
const level_1 = require("@civ-clone/civ1-difficulty/level");
// The first turn, in v474.05's count (0 at 4000 BC), on which barbarians may appear: 150 on Chieftain, 30 fewer for
//  each level up, to 30 on Emperor (`GameEngine.cs` `F0_1238_0980`).
const firstSpawnTurn = (level) => (5 - level) * 30;
exports.firstSpawnTurn = firstSpawnTurn;
/**
 * The first turn at an activity level (`lib/activity`): (5 − level) × its onset, which is `firstSpawnTurn` at v474.05's
 *  30. `Infinity` when it has none.
 */
const firstSpawnTurnAt = (level, activity) => activity.onset === Infinity ? Infinity : (5 - level) * activity.onset;
exports.firstSpawnTurnAt = firstSpawnTurnAt;
// v474.05 spawns barbarians once everyone has moved in its count C, and they first move in C + 1. The `Start` rules
//  run as our turn V begins, which plays count V − 1, so the count just completed, the one v474.05 tests, is V − 2.
const turnCount = (turn) => turn.value() - 2;
exports.turnCount = turnCount;
/**
 * The gate. Read at the level the game's `Activity` rules give (`lib/activity`), v474.05's when there are none, so
 *  `ruleRegistry` is the game's: with none given, v474.05's.
 */
const getRules = (gameDifficultyRegistry, ruleRegistry = null) => [
    new Spawning_1.default('civ1-barbarians:spawning/from-turn', new Effect_1.default((turn) => (0, exports.turnCount)(turn) >=
        (0, exports.firstSpawnTurnAt)((0, level_1.levelOf)(gameDifficultyRegistry), ruleRegistry === null ? activity_1.CLASSIC_ACTIVITY : (0, activity_1.activityOf)(ruleRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spawning.js.map
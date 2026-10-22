"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.firstSpawnTurn = void 0;
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Spawning_1 = require("../Spawning");
const level_1 = require("@civ-clone/civ1-difficulty/level");
// The first turn, in v474.05's count (0 at 4000 BC), on which barbarians may appear: 150 on Chieftain, 30 fewer for
//  each level up, to 30 on Emperor (`GameEngine.cs` `F0_1238_0980`).
const firstSpawnTurn = (level) => (5 - level) * 30;
exports.firstSpawnTurn = firstSpawnTurn;
const getRules = (gameDifficultyRegistry) => [
    new Spawning_1.default('civ1-barbarians:spawning/from-turn', new Effect_1.default((turn) => turn.value() - 1 >= (0, exports.firstSpawnTurn)((0, level_1.levelOf)(gameDifficultyRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=spawning.js.map
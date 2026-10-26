"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const core_game_1 = require("@civ-clone/core-game");
const build_1 = require("./Rules/City/build");
const captured_1 = require("./Rules/City/captured");
const barbarians_1 = require("./Rules/GoodyHut/barbarians");
const spawning_1 = require("./Rules/Turn/spawning");
const start_1 = require("./Rules/Turn/start");
const destroyed_1 = require("./Rules/Unit/destroyed");
const moved_1 = require("./Rules/Unit/moved");
const register = (game) => game.rules.register(...(0, build_1.default)(game.players, game.playerResearch, game.rules), ...(0, captured_1.default)(game), ...(0, barbarians_1.default)(game), ...(0, spawning_1.default)(game.difficulty), ...(0, start_1.default)(game), ...(0, destroyed_1.default)(game), ...(0, moved_1.default)(game));
exports.register = register;
// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
(0, exports.register)(core_game_1.defaultGame);
exports.default = exports.register;
//# sourceMappingURL=registerRules.js.map
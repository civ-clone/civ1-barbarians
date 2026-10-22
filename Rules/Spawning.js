"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spawning = void 0;
const Rule_1 = require("@civ-clone/core-rule/Rule");
/**
 * Whether barbarians may appear this turn. Every `Spawning` rule has to pass before a landing or an uprising is tried,
 * so a variant can change the gate (`Rules/Turn/spawning`) or add one of its own.
 */
class Spawning extends Rule_1.default {
}
exports.Spawning = Spawning;
exports.default = Spawning;
//# sourceMappingURL=Spawning.js.map
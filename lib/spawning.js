"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawning = void 0;
const Spawning_1 = require("../Rules/Spawning");
// Whether every `Spawning` rule allows barbarians this turn. With none registered there is no gate.
const spawning = (ruleRegistry, turn) => ruleRegistry.process(Spawning_1.default, turn).every(Boolean);
exports.spawning = spawning;
exports.default = exports.spawning;
//# sourceMappingURL=spawning.js.map
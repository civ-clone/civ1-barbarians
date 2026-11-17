"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payRansom = exports.RANSOM = void 0;
const ransom_1 = require("@civ-clone/base-barbarians/lib/ransom");
// What a barbarian leader's people pay for him, at every level (v474.05 `AttackActions.cs` 398–409).
exports.RANSOM = 100;
/**
 * Pays `player` the ransom for the barbarian leader `leader` and says so (`barbarians:ransom`: player, leader, gold),
 * through base-barbarians' `payRansom`. Whichever rule decides that a leader is ransomed pays through this, so the gold
 * and the notice are the same: this package's, and any that takes its place (civ-clone/web-renderer#954).
 */
const payRansom = (game, player, leader) => (0, ransom_1.default)(game, player, leader, exports.RANSOM);
exports.payRansom = payRansom;
exports.default = exports.payRansom;
//# sourceMappingURL=ransom.js.map
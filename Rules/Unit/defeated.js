"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Defeated_1 = require("@civ-clone/core-unit/Rules/Defeated");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const ransom_1 = require("../../lib/ransom");
/**
 * Ransom (civ-clone/web-renderer#171): a barbarian leader (the group's Diplomat) who defends and loses pays the
 * civilization that beat him 100 gold. As v474.05 (`BATTLE.C` `battle()`): only the unit that defended is looked at,
 * so a leader killed in a stack that another unit defended pays nothing, a leader who defends his stack pays, and a
 * leader who attacks and loses pays nothing (civ-clone/web-renderer#954). `civ1-enhanced` has a rule that pays for a
 * leader killed in a stack too, and takes this one's place while it is in force.
 */
const getRules = (game) => [
    new Defeated_1.default('civ1-barbarians:unit/defeated/ransom', 
    // `Attack` processes `Defeated` for a losing attacker too: the action's unit is the one that attacked.
    new Criterion_1.default((unit, by, action) => !action || action.unit() !== unit), new Criterion_1.default((unit) => unit instanceof Units_1.Diplomat && (0, isBarbarian_1.default)(unit.player())), new Criterion_1.default((unit, by) => !(0, isBarbarian_1.default)(by.player())), new Effect_1.default((unit, by) => (0, ransom_1.default)(game, by.player(), unit))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=defeated.js.map
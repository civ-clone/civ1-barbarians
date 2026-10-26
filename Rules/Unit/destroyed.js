"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.RANSOM = void 0;
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Destroyed_1 = require("@civ-clone/core-unit/Rules/Destroyed");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Gold_1 = require("@civ-clone/base-city-yield-gold/Gold");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
// What a barbarian leader's people pay for him, at every level (v474.05 `AttackActions.cs` 398–409).
exports.RANSOM = 100;
/**
 * Ransom (civ-clone/web-renderer#171): a barbarian leader (the group's Diplomat) killed by a civilization pays it 100
 * gold. On `Destroyed` rather than `Defeated`, so a leader killed in a stack pays too: the units dying with a defender
 * are only destroyed. Dom, 2026-10-23, against v474.05, where only a lone leader pays. Disbanding passes no player,
 * so a leader who gives up pays nothing.
 */
const getRules = (game) => [
    new Destroyed_1.default('civ1-barbarians:unit/destroyed/ransom', new Criterion_1.default((unit) => unit instanceof Units_1.Diplomat && (0, isBarbarian_1.default)(unit.player())), new Criterion_1.default((unit, player) => player !== null && !(0, isBarbarian_1.default)(player)), 
    // Once: a leader aboard a ship goes down with it, and then comes up again in the defeated stack, as
    //  `civ1-unit`'s count-loss rule allows for.
    new Criterion_1.default((unit) => !unit.destroyed()), new Effect_1.default((unit, player) => {
        game.playerTreasuries
            .getByPlayerAndType(player, Gold_1.default)
            .add(exports.RANSOM);
        game.engine.emit('barbarians:ransom', player, unit, exports.RANSOM);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=destroyed.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.BURNS_AT_ATTACK = void 0;
const Captured_1 = require("@civ-clone/core-city/Rules/Captured");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Low_1 = require("@civ-clone/core-rule/Priorities/Low");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
// Barbarians whose attack is no more than this burn a city rather than take it: Horsemen and Musketmen.
exports.BURNS_AT_ATTACK = 2;
// The barbarians' strongest attack on a city's square: the unit that took it, as `CaptureCity` doesn't say which. With
//  none there, nothing burns it.
const strongestAttack = (city, player, units) => units
    .getByTile(city.tile())
    .filter((unit) => unit.player() === player)
    .reduce((strongest, unit) => Math.max(strongest, unit.attack().value()), -Infinity);
/**
 * Barbarians too weak to hold a city burn it (civ-clone/web-renderer#171, v474.05 `Actions.cs` 21–78): taken by a
 * Horseman or a Musketman, it is destroyed; by anything stronger, it is captured as usual. Low priority, so it is
 * destroyed once the usual capture has run. A size-1 city is already destroyed by then (`civ1-city`'s shrink), and is
 * left alone: that is checked in the effect, as every criterion is checked before any rule's effect runs.
 */
const getRules = (game) => [
    new Captured_1.default('civ1-barbarians:city/captured/burn', new Low_1.default(), new Criterion_1.default((city, capturingPlayer) => (0, isBarbarian_1.default)(capturingPlayer)), new Criterion_1.default((city, capturingPlayer) => {
        const attack = strongestAttack(city, capturingPlayer, game.units);
        return attack !== -Infinity && attack <= exports.BURNS_AT_ATTACK;
    }), new Effect_1.default((city, capturingPlayer) => {
        if (!city.destroyed()) {
            city.destroy(capturingPlayer);
        }
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map
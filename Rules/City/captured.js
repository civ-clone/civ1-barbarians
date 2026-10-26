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
// The barbarians' strongest attack on a city's square: the unit that took it, as `CaptureCity` doesn't say which.
const strongestAttack = (city, player, units) => Math.max(...units
    .getByTile(city.tile())
    .filter((unit) => unit.player() === player)
    .map((unit) => unit.attack().value()));
/**
 * Barbarians too weak to hold a city burn it (civ-clone/web-renderer#171, v474.05 `Actions.cs` 21–78): taken by a
 * Horseman or a Musketman, it is destroyed; by anything stronger, it is captured as usual. Low priority, so it is
 * destroyed once the usual capture has run: run before, `civ1-city`'s shrink would destroy a size-1 city a second time.
 */
const getRules = (game) => [
    new Captured_1.default('civ1-barbarians:city/captured/burn', new Low_1.default(), new Criterion_1.default((city, capturingPlayer) => (0, isBarbarian_1.default)(capturingPlayer)), new Criterion_1.default((city) => !city.destroyed()), new Criterion_1.default((city, capturingPlayer) => strongestAttack(city, capturingPlayer, game.units) <= exports.BURNS_AT_ATTACK), new Effect_1.default((city, capturingPlayer) => city.destroy(capturingPlayer))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=captured.js.map
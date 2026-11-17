"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barbarianPlayer = exports.STARTING_ADVANCES_RULE = void 0;
const barbarianPlayer_1 = require("@civ-clone/base-barbarians/lib/barbarianPlayer");
const Governments_1 = require("@civ-clone/civ1-government/Governments");
// The rule that gives a new player its random starting advances. Barbarians never have an advance, and `Player`'s
//  `Added` rules run before its civilization is set, so the rule is held off while the barbarian player is added, as
//  `civ1-game-end`'s respawn does.
exports.STARTING_ADVANCES_RULE = 'civ1-science:player/added/starting-advances';
/**
 * The barbarian player, made at the first spawn (civ-clone/web-renderer#169) by base-barbarians' `barbarianPlayer`, so
 * that a new game and an old save take the same path and nobody takes an empty turn before the barbarians are due.
 *
 * Its government is set to Anarchy, which it never leaves: no taxes, no science and no upkeep, and production as usual.
 * A revolution is never offered in Anarchy, and only a Democracy's civil disorder starts one. `civ1-science`'s starting
 * advances are held off while it is added.
 *
 * The spawn runs as a turn starts. When that turn's players are already queued (`civ1-player` queues them before the
 * `Start` rules run), the new player joins the end of the queue, so its first raiders move this turn, as v474.05's
 * do the turn after they appear; queued later, the queue already holds it.
 */
const barbarianPlayer = (game, world) => (0, barbarianPlayer_1.default)(game, world, {
    government: Governments_1.Anarchy,
    heldOff: [exports.STARTING_ADVANCES_RULE],
});
exports.barbarianPlayer = barbarianPlayer;
exports.default = exports.barbarianPlayer;
//# sourceMappingURL=barbarianPlayer.js.map
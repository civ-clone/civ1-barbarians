"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.barbarianPlayer = exports.STARTING_ADVANCES_RULE = void 0;
const addPlayer_1 = require("@civ-clone/civ1-player/lib/addPlayer");
const Governments_1 = require("@civ-clone/civ1-government/Governments");
const Leaders_1 = require("@civ-clone/base-civilization-barbarian/Leaders");
const Barbarian_1 = require("@civ-clone/base-civilization-barbarian/Barbarian");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
// The rule that gives a new player its random starting advances. Barbarians never have an advance, and `Player`'s
//  `Added` rules run before its civilization is set, so the rule is held off while the barbarian player is added, as
//  `civ1-game-end`'s respawn does.
exports.STARTING_ADVANCES_RULE = 'civ1-science:player/added/starting-advances';
/**
 * The barbarian player, made at the first spawn (civ-clone/web-renderer#169) so that a new game and an old save take
 * the same path and nobody takes an empty turn before the barbarians are due.
 *
 * It claims `Barbarian` and `Attila` through `addPlayer`, which wants both in the registries and takes them out again,
 * so they are registered just for that: they are never offered to anyone else. `player:spawned` is emitted for the
 * host to give it its client. Its government is set to Anarchy, which it never leaves: no taxes, no science and no
 * upkeep, and production as usual. A revolution is never offered in Anarchy, and only a Democracy's civil disorder
 * starts one.
 *
 * The spawn runs as a turn starts. When that turn's players are already queued (`civ1-player` queues them before the
 * `Start` rules run), the new player joins the end of the queue, so its first raiders move this turn, as v474.05's
 * do the turn after they appear; queued later, the queue already holds it.
 */
const barbarianPlayer = (game, world) => {
    var _a;
    const existing = game.players
        .entries()
        .find((player) => (0, isBarbarian_1.default)(player));
    if (existing) {
        return existing;
    }
    const startingAdvances = game.rules.getById(exports.STARTING_ADVANCES_RULE), startingAdvancesEnabled = (_a = startingAdvances === null || startingAdvances === void 0 ? void 0 : startingAdvances.enabled()) !== null && _a !== void 0 ? _a : false;
    if (!game.civilizations.includes(Barbarian_1.default)) {
        game.civilizations.register(Barbarian_1.default);
    }
    if (!game.leaders.includes(Leaders_1.Attila)) {
        game.leaders.register(Leaders_1.Attila);
    }
    startingAdvances === null || startingAdvances === void 0 ? void 0 : startingAdvances.disable();
    let player;
    try {
        player = (0, addPlayer_1.default)(game, world, {
            civilization: Barbarian_1.default,
            leader: Leaders_1.Attila,
        });
    }
    finally {
        if (startingAdvancesEnabled) {
            startingAdvances.enable();
        }
        if (game.civilizations.includes(Barbarian_1.default)) {
            game.civilizations.unregister(Barbarian_1.default);
        }
        if (game.leaders.includes(Leaders_1.Attila)) {
            game.leaders.unregister(Leaders_1.Attila);
        }
    }
    game.playerGovernments.getByPlayer(player).set(new Governments_1.Anarchy());
    if (game.currentPlayers.length > 0 && !game.currentPlayers.includes(player)) {
        game.currentPlayers.register(player);
    }
    return player;
};
exports.barbarianPlayer = barbarianPlayer;
exports.default = exports.barbarianPlayer;
//# sourceMappingURL=barbarianPlayer.js.map
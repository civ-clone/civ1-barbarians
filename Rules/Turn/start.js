"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.uprisingUnits = exports.uprisingSize = exports.raidersAtSea = exports.SEA_POLAR_ROWS = void 0;
const Units_1 = require("@civ-clone/civ1-unit/Units");
const barbarianPlayer_1 = require("../../lib/barbarianPlayer");
const spawnUnits_1 = require("../../lib/spawnUnits");
const landUprising_1 = require("../../lib/landUprising");
const Automobile_1 = require("@civ-clone/base-science-advance-automobile/Automobile");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Explosives_1 = require("@civ-clone/base-science-advance-explosives/Explosives");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const RuleIds_1 = require("../../RuleIds");
const anyoneHas_1 = require("../../lib/anyoneHas");
const isHuman_1 = require("@civ-clone/civ1-difficulty/isHuman");
const polar_1 = require("../../lib/polar");
const spawning_1 = require("./spawning");
const spawning_2 = require("../../lib/spawning");
const waterBody_1 = require("../../lib/waterBody");
const worldOf_1 = require("../../lib/worldOf");
// A raiding ship appears no nearer than this many of v474.05's 50 rows to either edge of the map.
exports.SEA_POLAR_ROWS = 3;
// The squares a raiding party's ship, and an uprising, are sized by.
const raidersAtSea = (turnCount) => Math.min(Math.max(Math.floor(turnCount / 150) + 1, 1), 3);
exports.raidersAtSea = raidersAtSea;
var landUprising_2 = require("../../lib/landUprising");
Object.defineProperty(exports, "uprisingSize", { enumerable: true, get: function () { return landUprising_2.uprisingSize; } });
Object.defineProperty(exports, "uprisingUnits", { enumerable: true, get: function () { return landUprising_2.uprisingUnits; } });
/**
 * When barbarians appear, once every player has moved in v474.05 (`GameEngine.cs` `F0_1238_0980`), at the start of
 * the next turn here (`turnCount`), with the barbarians first to move. Each rule's gate is every `Spawning` rule
 * (`Rules/Turn/spawning`: turn (5 − level) × 30). The barbarian player is made by the first spawn.
 */
const getRules = (game) => [
    // Every 8th turn, until anyone has Automobile, a Sail (a Frigate from turn 300) appears on an empty square of a sea
    //  of at least 16 squares, clear of the poles, carrying 1 to 3 Swordmen (Knights once anyone has Explosives) and a
    //  Diplomat. Where it goes is the barbarian client's business.
    new Start_1.default('civ1-barbarians:turn/start/sea-landing', new Criterion_1.default((turn) => (0, spawning_2.default)(game.rules, turn)), 
    // v474.05's `(turnCount + 1) % 8 === 0`.
    new Criterion_1.default((turn) => ((0, spawning_1.turnCount)(turn) + 1) % 8 === 0), new Criterion_1.default(() => !(0, anyoneHas_1.default)(game.playerResearch, Automobile_1.default)), new Effect_1.default((turn) => {
        const world = (0, worldOf_1.default)(game);
        if (world === null) {
            return;
        }
        const height = world.height(), margin = (0, polar_1.polarRows)(height, exports.SEA_POLAR_ROWS), candidates = world
            .entries()
            .filter((tile) => tile.isWater() &&
            tile.y() >= margin &&
            tile.y() < height - margin &&
            game.units.getByTile(tile).length === 0);
        let tile = null;
        // v474.05 draws squares until one will do; a world with little open sea gives up after a while instead.
        for (let tries = 0; tries < 100 && candidates.length > 0; tries++) {
            const candidate = candidates[Math.floor(game.rng() * candidates.length)];
            if ((0, waterBody_1.default)(candidate, 16)) {
                tile = candidate;
                break;
            }
        }
        if (tile === null) {
            return;
        }
        const raiders = (0, exports.raidersAtSea)((0, spawning_1.turnCount)(turn)), player = (0, barbarianPlayer_1.default)(game, world), ship = (0, spawnUnits_1.createUnit)((raiders < 3 ? Units_1.Sail : Units_1.Frigate), player, tile, game.rules), Raider = (0, anyoneHas_1.default)(game.playerResearch, Explosives_1.default) ? Units_1.Knight : Units_1.Swordman;
        (0, spawnUnits_1.default)(player, tile, [...new Array(raiders).fill(Raider), Units_1.Diplomat], game.rules, ship);
        game.engine.emit('barbarians:raiders-at-sea', player, ship, tile);
    })),
    // Each turn one of 128 city slots is drawn, as v474.05 does, and a city there may rise (`lib/landUprising`). As
    //  v474.05, only the human's city (civd `TURN.C` `uprising()`, civ-clone/web-renderer#954):
    //
    //      i = rand_scaled(128);
    //      if (townbuf[i].status == -1 || townbuf[i].owner != civnow)
    //          return;
    //
    //  The square is found near it, re-centred on the city nearest each try, so the uprising may be nearer another
    //  civilization's city, and is sized by that one. `civ1-enhanced` lets any civilization's city rise
    //  (civ-clone/web-renderer#27), taking this rule's place while its set is on.
    new Start_1.default(RuleIds_1.LAND_UPRISING_RULE, new Criterion_1.default((turn) => (0, spawning_2.default)(game.rules, turn)), new Effect_1.default(() => (0, landUprising_1.default)(game, (city) => (0, isHuman_1.default)(city.player(), game.clients)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map
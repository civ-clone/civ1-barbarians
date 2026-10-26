"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.hordeUnit = exports.hordeSquares = void 0;
const Units_1 = require("@civ-clone/civ1-unit/Units");
const barbarianPlayer_1 = require("../../lib/barbarianPlayer");
const Barbarians_1 = require("@civ-clone/civ1-goody-hut/Rules/GoodyHut/Barbarians");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Terrains_1 = require("@civ-clone/civ1-world/Terrains");
const spawnUnits_1 = require("../../lib/spawnUnits");
/**
 * Where a hut's horde stands (v474.05 OpenCiv1 `Segment_1866`, from 0x1c71): round the hut's neighbours from the north,
 * clockwise, stepping by `clamp(4 − cities, 1, 4)`. So up to 3, 4 or 8 units for a player with 1, 2, or 3 or more
 * cities. A square that isn't free is passed over, not replaced.
 */
const hordeSquares = (hut, cities, free) => {
    const step = Math.min(Math.max(4 - cities, 1), 4);
    return hut
        .getNeighbours()
        .filter((tile, index) => index % step === 0)
        .filter(free);
};
exports.hordeSquares = hordeSquares;
// Each a Horseman (v474.05's Cavalry), or a Swordman (its Legion) on Mountains.
const hordeUnit = (tile) => tile.terrain() instanceof Terrains_1.Mountains ? Units_1.Swordman : Units_1.Horseman;
exports.hordeUnit = hordeUnit;
/** The horde a goody hut unleashes (civ-clone/web-renderer#172), on the empty, non-city land around it. */
const getRules = (game) => [
    new Barbarians_1.default('civ1-barbarians:goody-hut/barbarians/horde', new Effect_1.default((goodyHut, unit) => {
        const squares = (0, exports.hordeSquares)(goodyHut.tile(), game.cities.getByPlayer(unit.player()).length, (tile) => tile.isLand() &&
            game.cities.getByTile(tile) === null &&
            game.units.getByTile(tile).length === 0);
        if (squares.length === 0) {
            return;
        }
        const player = (0, barbarianPlayer_1.default)(game, goodyHut.tile().map());
        squares.forEach((tile) => {
            (0, spawnUnits_1.default)(player, tile, [(0, exports.hordeUnit)(tile)], game.rules);
        });
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=barbarians.js.map
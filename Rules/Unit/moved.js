"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.PILLAGERS = void 0;
const Units_1 = require("@civ-clone/civ1-unit/Units");
const TileImprovements_1 = require("@civ-clone/civ1-world/TileImprovements");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const Pillaged_1 = require("@civ-clone/core-tile-improvement/Rules/Pillaged");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
// The barbarians that wreck farms and mines on their way: not Swordmen or Knights, the raiders that come by sea.
exports.PILLAGERS = [
    Units_1.Horseman,
    Units_1.Chariot,
    Units_1.Musketman,
    Units_1.Cannon,
];
// Where a move started: every move action has one, and an action that isn't a move has none.
const from = (action) => typeof action.from === 'function'
    ? action.from()
    : null;
const wreckable = (tile, game) => game.tileImprovements
    .getByTile(tile)
    .filter((improvement) => improvement instanceof TileImprovements_1.Irrigation || improvement instanceof TileImprovements_1.Mine);
const nearestCity = (tile, game) => game.cities
    .entries()
    .filter((city) => !city.destroyed())
    .reduce((nearest, city) => nearest === null ||
    tile.distanceFrom(city.tile()) < tile.distanceFrom(nearest.tile())
    ? city
    : nearest, null);
/**
 * Pillage (civ-clone/web-renderer#171, v474.05 `PlayerTurn.cs` 1739–1760): a barbarian Horseman, Chariot, Musketman
 * or Cannon leaving a square outside a city that has irrigation or a mine, whose nearest city is a civilization's,
 * destroys both, and stops. Through the `Pillaged` rules, so the square's yields are refreshed.
 */
const getRules = (game) => [
    new Moved_1.default('civ1-barbarians:unit/moved/pillage', new Criterion_1.default((unit) => (0, isBarbarian_1.default)(unit.player())), new Criterion_1.default((unit) => exports.PILLAGERS.some((UnitType) => unit instanceof UnitType)), new Criterion_1.default((unit, action) => {
        const tile = from(action);
        // Left it: an attack that didn't move the unit passes through here too.
        return (tile !== null &&
            tile !== unit.tile() &&
            game.cities.getByTile(tile) === null &&
            wreckable(tile, game).length > 0);
    }), new Criterion_1.default((unit, action) => {
        const city = nearestCity(from(action), game);
        return city !== null && !(0, isBarbarian_1.default)(city.player());
    }), new Effect_1.default((unit, action) => {
        const tile = from(action);
        wreckable(tile, game).forEach((improvement) => {
            game.rules.process(Pillaged_1.default, tile, improvement);
        });
        unit.moves().set(0);
        unit.setActive(false);
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=moved.js.map
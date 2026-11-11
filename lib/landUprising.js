"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landUprising = exports.uprisingUnits = exports.uprisingSize = void 0;
const Units_1 = require("@civ-clone/civ1-unit/Units");
const barbarianPlayer_1 = require("./barbarianPlayer");
const Industrialization_1 = require("@civ-clone/base-science-advance-industrialization/Industrialization");
const anyoneHas_1 = require("./anyoneHas");
const cityGold_1 = require("./cityGold");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const spawnUnits_1 = require("./spawnUnits");
// How many rise: max(⌊size ÷ 2 random⌋, 2) + 1.
const uprisingSize = (citySize, roll) => Math.min(Math.max(Math.floor(roll * Math.floor(citySize / 2)), 2), 99) + 1;
exports.uprisingSize = uprisingSize;
// Horsemen and Chariots in blocks of four (Musketmen and Cannon once anyone has Industrialization), the last a Diplomat:
//  the leader of the uprising.
const uprisingUnits = (count, industrial) => new Array(count).fill(null).map((_, i) => {
    if (i === count - 1) {
        return Units_1.Diplomat;
    }
    if (industrial) {
        return (i & 4) === 0 ? Units_1.Musketman : Units_1.Cannon;
    }
    return (i & 4) === 0 ? Units_1.Horseman : Units_1.Chariot;
});
exports.uprisingUnits = uprisingUnits;
const nearestCity = (tile, cities) => cities.reduce((nearest, city) => tile.distanceFrom(city.tile()) < tile.distanceFrom(nearest.tile())
    ? city
    : nearest, cities[0]);
/**
 * A turn's chance of an uprising on land, as v474.05's (civd `TURN.C` `uprising()`): one of 128 city slots is drawn,
 * and a city there that `rises` may rise with a chance of its gold in 100. The square is found by up to 99 tries within
 * 6 of the city, each re-centred on the city nearest the last try: empty land on that city's land mass, at least 6 from
 * it, with no civilization's unit next to it. The group is sized by that city. Which cities may rise is the rule's:
 * whichever rule raises an uprising does so through this, so the units and `barbarians:uprising` are the same
 * (civ-clone/web-renderer#954).
 */
const landUprising = (game, rises) => {
    const cities = game.cities
        .entries()
        .filter((city) => !city.destroyed() && !(0, isBarbarian_1.default)(city.player())), slot = Math.floor(game.rng() * 128);
    if (slot >= cities.length) {
        return;
    }
    const city = cities[slot];
    if (!rises(city)) {
        return;
    }
    if (Math.floor(game.rng() * 100) >= (0, cityGold_1.default)(city, game)) {
        return;
    }
    const world = city.tile().map(), allCities = game.cities
        .entries()
        .filter((city) => !city.destroyed());
    let target = city, tile = null;
    for (let tries = 0; tries < 99; tries++) {
        const centre = target.tile(), x = centre.x() + Math.floor(game.rng() * 13) - 6, y = centre.y() + Math.floor(game.rng() * 13) - 6;
        if (y < 0 || y >= world.height()) {
            continue;
        }
        const candidate = world.get(x, y);
        target = nearestCity(candidate, allCities);
        if (candidate.distanceFrom(target.tile()) < 6 ||
            !candidate.isLand() ||
            game.units.getByTile(candidate).length > 0 ||
            game.landMasses.getByTile(candidate) !==
                game.landMasses.getByTile(target.tile()) ||
            candidate
                .getNeighbours()
                .some((neighbour) => neighbour.isLand() &&
                game.units
                    .getByTile(neighbour)
                    .some((unit) => !(0, isBarbarian_1.default)(unit.player())))) {
            continue;
        }
        tile = candidate;
        break;
    }
    if (tile === null) {
        return;
    }
    const count = (0, exports.uprisingSize)(game.cityGrowth.getByCity(target).size(), game.rng()), industrial = (0, anyoneHas_1.default)(game.playerResearch, Industrialization_1.default), player = (0, barbarianPlayer_1.default)(game, world);
    (0, spawnUnits_1.default)(player, tile, (0, exports.uprisingUnits)(count, industrial), game.rules);
    game.engine.emit('barbarians:uprising', player, target, tile, industrial);
};
exports.landUprising = landUprising;
exports.default = exports.landUprising;
//# sourceMappingURL=landUprising.js.map
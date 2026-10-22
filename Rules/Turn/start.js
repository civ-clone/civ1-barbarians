"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.uprisingUnits = exports.uprisingSize = exports.raidersAtSea = exports.SEA_POLAR_ROWS = void 0;
const Units_1 = require("@civ-clone/civ1-unit/Units");
const barbarianPlayer_1 = require("../../lib/barbarianPlayer");
const spawnUnits_1 = require("../../lib/spawnUnits");
const Automobile_1 = require("@civ-clone/base-science-advance-automobile/Automobile");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Explosives_1 = require("@civ-clone/base-science-advance-explosives/Explosives");
const Industrialization_1 = require("@civ-clone/base-science-advance-industrialization/Industrialization");
const Start_1 = require("@civ-clone/core-turn-based-game/Rules/Start");
const anyoneHas_1 = require("../../lib/anyoneHas");
const cityGold_1 = require("../../lib/cityGold");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const polar_1 = require("../../lib/polar");
const spawning_1 = require("../../lib/spawning");
const waterBody_1 = require("../../lib/waterBody");
const worldOf_1 = require("../../lib/worldOf");
// A raiding ship appears no nearer than this many of v474.05's 50 rows to either edge of the map.
exports.SEA_POLAR_ROWS = 3;
// The squares a raiding party's ship, and an uprising, are sized by.
const raidersAtSea = (turnCount) => Math.min(Math.max(Math.floor(turnCount / 150) + 1, 1), 3);
exports.raidersAtSea = raidersAtSea;
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
 * When barbarians appear, once every player has moved in v474.05 (`GameEngine.cs` `F0_1238_0980`), at the start of
 * the turn here, with the barbarians first to move. Each rule's gate is every `Spawning` rule (`Rules/Turn/spawning`:
 * turn (5 − level) × 30). The barbarian player is made by the first spawn.
 */
const getRules = (game) => [
    // Every 8th turn, until anyone has Automobile, a Sail (a Frigate from turn 300) appears on an empty square of a sea
    //  of at least 16 squares, clear of the poles, carrying 1 to 3 Swordmen (Knights once anyone has Explosives) and a
    //  Diplomat. Where it goes is the barbarian client's business.
    new Start_1.default('civ1-barbarians:turn/start/sea-landing', new Criterion_1.default((turn) => (0, spawning_1.default)(game.rules, turn)), 
    // `(turnCount + 1) % 8 === 0`, with `turnCount` being `turn.value() - 1`.
    new Criterion_1.default((turn) => turn.value() % 8 === 0), new Criterion_1.default(() => !(0, anyoneHas_1.default)(game.playerResearch, Automobile_1.default)), new Effect_1.default((turn) => {
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
        const raiders = (0, exports.raidersAtSea)(turn.value() - 1), player = (0, barbarianPlayer_1.default)(game, world), ship = (0, spawnUnits_1.createUnit)((raiders < 3 ? Units_1.Sail : Units_1.Frigate), player, tile, game.rules), Raider = (0, anyoneHas_1.default)(game.playerResearch, Explosives_1.default) ? Units_1.Knight : Units_1.Swordman;
        (0, spawnUnits_1.default)(player, tile, [...new Array(raiders).fill(Raider), Units_1.Diplomat], game.rules, ship);
        game.engine.emit('barbarians:raiders-at-sea', player, ship, tile);
    })),
    // Each turn one of 128 city slots is drawn, as v474.05 does; an occupied one may rise with a chance of its gold in
    //  100. Any civilization's city, not only the human's (civ-clone/web-renderer#27). The square is found by up to 99
    //  tries within 6 of the city, each re-centred on the city nearest the last try: empty land on that city's land mass,
    //  at least 6 from it, with no civilization's unit next to it. The group is sized by that city.
    new Start_1.default('civ1-barbarians:turn/start/land-uprising', new Criterion_1.default((turn) => (0, spawning_1.default)(game.rules, turn)), new Effect_1.default(() => {
        const cities = game.cities
            .entries()
            .filter((city) => !city.destroyed() && !(0, isBarbarian_1.default)(city.player())), slot = Math.floor(game.rng() * 128);
        if (slot >= cities.length) {
            return;
        }
        const city = cities[slot];
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
    })),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=start.js.map
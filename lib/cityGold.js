"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cityGold = void 0;
const Gold_1 = require("@civ-clone/base-city-yield-gold/Gold");
/**
 * What a city is worth to a raider: its owner's gold, shared out among its citizens (v474.05 `Actions.cs`
 * `F0_2459_0687_GetCityTreasury`: gold × size ÷ (the owner's citizens + 1), in whole gold). It sets a city's chance of
 * an uprising and which city a raiding ship sails for.
 */
const cityGold = (city, { cities, cityGrowth, playerTreasuries }) => {
    const player = city.player(), gold = playerTreasuries.getByPlayerAndType(player, Gold_1.default).value(), size = cityGrowth.getByCity(city).size(), citizens = cities
        .getByPlayer(player)
        .reduce((total, other) => total + cityGrowth.getByCity(other).size(), 0);
    return Math.floor((gold * size) / (citizens + 1));
};
exports.cityGold = cityGold;
exports.default = exports.cityGold;
//# sourceMappingURL=cityGold.js.map
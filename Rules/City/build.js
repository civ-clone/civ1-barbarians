"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.availableToBarbarians = exports.CIVILIZATIONS_NEEDED = void 0;
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const Types_1 = require("@civ-clone/civ1-unit/Types");
const Attack_1 = require("@civ-clone/core-unit/Yields/Attack");
const Yield_1 = require("@civ-clone/core-unit/Rules/Yield");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
const requiredAdvances_1 = require("@civ-clone/civ1-unit/lib/requiredAdvances");
// How many civilizations must be able to build a unit before a barbarian city can.
exports.CIVILIZATIONS_NEEDED = 2;
// A unit type's attack before anything modifies it, by the ruleset's `BaseYield` rules.
const baseAttack = (UnitType, ruleRegistry) => {
    const attack = new Attack_1.default();
    ruleRegistry.process(Yield_1.BaseYield, UnitType, attack);
    return attack.value();
};
/**
 * Whether a barbarian city may build `Item`: a land unit that attacks, other than Settlers, a Diplomat or a Caravan,
 * that at least two civilizations know how to build (civ-clone/web-renderer#27, decision 3). Never a ship, an
 * aircraft or a missile (the barbarians' client moves land units and transports only), an improvement or a Wonder.
 * v474.05's barbarian cities build Legions, then Knights.
 */
const availableToBarbarians = (Item, playerRegistry, playerResearchRegistry, ruleRegistry) => {
    if (!Object.prototype.isPrototypeOf.call(Types_1.Land, Item)) {
        return false;
    }
    const UnitType = Item;
    if (UnitType === Units_1.Settlers ||
        UnitType === Units_1.Diplomat ||
        UnitType === Units_1.Caravan ||
        baseAttack(UnitType, ruleRegistry) <= 0) {
        return false;
    }
    const RequiredAdvance = (0, requiredAdvances_1.requiredAdvanceFor)(UnitType);
    if (RequiredAdvance === null) {
        return true;
    }
    return (playerRegistry
        .entries()
        .filter((player) => !(0, isBarbarian_1.default)(player) &&
        playerResearchRegistry.getByPlayer(player).completed(RequiredAdvance)).length >= exports.CIVILIZATIONS_NEEDED);
};
exports.availableToBarbarians = availableToBarbarians;
const getRules = (playerRegistry, playerResearchRegistry, ruleRegistry) => [
    new Build_1.Build('civ1-barbarians:city/build/raiders-only', new Criterion_1.default((city) => (0, isBarbarian_1.default)(city.player())), new Effect_1.default((city, Item) => new Criterion_1.default(() => (0, exports.availableToBarbarians)(Item, playerRegistry, playerResearchRegistry, ruleRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnUnits = exports.createUnit = void 0;
const Stowed_1 = require("@civ-clone/base-unit-action-embark/Busy/Stowed");
const createUnit = (UnitType, player, tile, ruleRegistry) => new UnitType(null, player, tile, ruleRegistry);
exports.createUnit = createUnit;
/**
 * A group of barbarians on `tile`, one of each of `types` in order. Aboard `transport` when given, as the raiders a
 * ship brings are: stowed and inactive until it lands them, like units that embarked.
 */
const spawnUnits = (player, tile, types, ruleRegistry, transport = null) => types.map((UnitType) => {
    const unit = (0, exports.createUnit)(UnitType, player, tile, ruleRegistry);
    if (transport !== null) {
        transport.stow(unit, tile);
        unit.setBusy(new Stowed_1.default());
        unit.setActive(false);
    }
    return unit;
});
exports.spawnUnits = spawnUnits;
exports.default = exports.spawnUnits;
//# sourceMappingURL=spawnUnits.js.map
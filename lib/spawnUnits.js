"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnUnits = exports.createUnit = void 0;
const Stowed_1 = require("@civ-clone/base-unit-action-embark/Busy/Stowed");
const createUnit = (UnitType, player, tile, ruleRegistry) => new UnitType(null, player, tile, ruleRegistry);
exports.createUnit = createUnit;
/**
 * A group of barbarians on `tile`, one of each of `types` in order. Aboard `transport` when given, as the raiders a
 * ship brings are: stowed and inactive until it lands them, like units that embarked. One the ship can't take (a
 * variant's capacity or `CanStow` rules) is removed again rather than left asleep at sea.
 */
const spawnUnits = (player, tile, types, ruleRegistry, transport = null) => types.flatMap((UnitType) => {
    const unit = (0, exports.createUnit)(UnitType, player, tile, ruleRegistry);
    if (transport !== null) {
        if (!transport.stow(unit, tile)) {
            unit.destroy();
            return [];
        }
        unit.setBusy(new Stowed_1.default());
        unit.setActive(false);
    }
    return [unit];
});
exports.spawnUnits = spawnUnits;
exports.default = exports.spawnUnits;
//# sourceMappingURL=spawnUnits.js.map
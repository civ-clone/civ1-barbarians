"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worldOf = void 0;
// The world the game is played on, from any city or unit in it: a `Game` holds no world of its own, and the rules here
//  run long after it was built. `null` before anything is on the map, when there is nothing to raid anyway.
const worldOf = ({ cities, units, }) => {
    var _a, _b;
    const city = cities
        .entries()
        .find((city) => !city.destroyed()), [unit] = units.entries();
    return (_b = (_a = (city !== null && city !== void 0 ? city : unit)) === null || _a === void 0 ? void 0 : _a.tile().map()) !== null && _b !== void 0 ? _b : null;
};
exports.worldOf = worldOf;
exports.default = exports.worldOf;
//# sourceMappingURL=worldOf.js.map
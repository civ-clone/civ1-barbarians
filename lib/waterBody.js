"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waterBodyHasAtLeast = void 0;
// Whether the body of water `tile` is in has at least `size` squares: a raiding ship appears on a sea, not a lake
//  (v474.05 asks for 16). The search stops as soon as it has seen enough.
const waterBodyHasAtLeast = (tile, size) => {
    if (!tile.isWater()) {
        return false;
    }
    const seen = new Set([tile]), queue = [tile];
    while (queue.length > 0 && seen.size < size) {
        queue
            .shift()
            .getNeighbours()
            .forEach((neighbour) => {
            if (neighbour.isWater() && !seen.has(neighbour)) {
                seen.add(neighbour);
                queue.push(neighbour);
            }
        });
    }
    return seen.size >= size;
};
exports.waterBodyHasAtLeast = waterBodyHasAtLeast;
exports.default = exports.waterBodyHasAtLeast;
//# sourceMappingURL=waterBody.js.map
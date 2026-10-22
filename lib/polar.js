"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearPole = exports.polarRows = void 0;
// v474.05's map has 50 rows: a raiding ship appears no nearer than 3 rows to either edge, and a barbarian within 2 rows
//  of one leaves the map. The same share of our map's height.
const polarRows = (height, rows) => Math.round((height * rows) / 50);
exports.polarRows = polarRows;
const nearPole = (tile, rows) => {
    const height = tile.map().height(), margin = (0, exports.polarRows)(height, rows);
    return tile.y() < margin || tile.y() >= height - margin;
};
exports.nearPole = nearPole;
exports.default = exports.nearPole;
//# sourceMappingURL=polar.js.map
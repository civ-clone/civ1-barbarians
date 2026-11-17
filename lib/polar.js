"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nearPole = exports.polarRows = exports.MAP_ROWS = void 0;
const polar_1 = require("@civ-clone/base-barbarians/lib/polar");
// v474.05's map has 50 rows: a raiding ship appears no nearer than 3 rows to either edge, and a barbarian within 2 rows
//  of one leaves the map. The same share of our map's height.
exports.MAP_ROWS = 50;
const polarRows = (height, rows) => (0, polar_1.polarRows)(height, rows, exports.MAP_ROWS);
exports.polarRows = polarRows;
const nearPole = (tile, rows) => (0, polar_1.default)(tile, rows, exports.MAP_ROWS);
exports.nearPole = nearPole;
exports.default = exports.nearPole;
//# sourceMappingURL=polar.js.map
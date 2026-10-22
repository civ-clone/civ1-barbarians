"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyoneHas = void 0;
// Whether any player, in the game or gone, has `AdvanceType`: v474.05 keeps who discovered each advance first, and
//  the barbarians' ships, raiders and uprisings follow the world's progress rather than any one civilization's.
const anyoneHas = (playerResearchRegistry, AdvanceType) => playerResearchRegistry.some((playerResearch) => playerResearch.completed(AdvanceType));
exports.anyoneHas = anyoneHas;
exports.default = exports.anyoneHas;
//# sourceMappingURL=anyoneHas.js.map
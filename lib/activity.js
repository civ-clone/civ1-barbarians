"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityOf = exports.CLASSIC_ACTIVITY = void 0;
const Activity_1 = require("../Rules/Activity");
/** v474.05's numbers, played when no `Activity` rule answers. */
exports.CLASSIC_ACTIVITY = Object.freeze({
    onset: 30,
    landingEvery: 8,
    raidersEvery: 150,
    extra: 0,
    uprisingChance: 1,
});
/**
 * The numbers the barbarians play by in a game: the first `Activity` rule's answer, or v474.05's when none answers (no
 *  rule registered, or none switched on). An answering rule may draw from the game's random numbers the first time it
 *  is asked (`civ1-enhanced`'s random level does, from the first turn's gate), so ask only where play does.
 */
const activityOf = (rules) => {
    const [answer] = rules
        .process(Activity_1.default)
        .filter((answer) => answer !== undefined && answer !== null);
    return answer !== null && answer !== void 0 ? answer : exports.CLASSIC_ACTIVITY;
};
exports.activityOf = activityOf;
exports.default = exports.activityOf;
//# sourceMappingURL=activity.js.map
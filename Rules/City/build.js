"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRules = exports.barbarianUnit = void 0;
const Build_1 = require("@civ-clone/core-city-build/Rules/Build");
const Units_1 = require("@civ-clone/civ1-unit/Units");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Explosives_1 = require("@civ-clone/base-science-advance-explosives/Explosives");
const RuleIds_1 = require("../../RuleIds");
const anyoneHas_1 = require("../../lib/anyoneHas");
const isBarbarian_1 = require("@civ-clone/base-civilization-barbarian/isBarbarian");
/**
 * The one unit a barbarian city builds, as v474.05 chooses it (civd `ECONOMY.C` `find_slot()`, civ-clone/web-renderer#954):
 * a Warrior (`UTYPE_MILITIA`) while the barbarians have no unit anywhere, then a Swordman (`UTYPE_LEGION`) until anyone
 * has Explosives (advance 56), and a Knight (`UTYPE_KNIGHTS`) after:
 *
 *     if (troops_total[civ] == 0 && civ != civnow && civ_gov[civ] <= 1)
 *         return 1;
 *     if (civ == 0) {
 *         if (!(advance_owners[56] & 7))
 *             return 3;
 *         return 7;
 *     }
 *
 * The barbarians' government is Anarchy for good, so `civ_gov[civ] <= 1` always holds. Their cities never build an
 * improvement, a Wonder or any other unit, and need no advance for these.
 */
const barbarianUnit = (barbarians, playerResearchRegistry, unitRegistry) => {
    if (unitRegistry.getByPlayer(barbarians).length === 0) {
        return Units_1.Warrior;
    }
    return (0, anyoneHas_1.default)(playerResearchRegistry, Explosives_1.default) ? Units_1.Knight : Units_1.Swordman;
};
exports.barbarianUnit = barbarianUnit;
/**
 * What a barbarian city may build: `barbarianUnit`, and nothing else. `civ1-unit`'s advance rules leave barbarian
 * cities to this one. `civ1-enhanced` lets them build any attacking land unit two civilizations can build
 * (civ-clone/web-renderer#27), taking this rule's place while its set is on.
 */
const getRules = (playerResearchRegistry, unitRegistry) => [
    new Build_1.Build(RuleIds_1.RAIDERS_ONLY_RULE, new Criterion_1.default((city) => (0, isBarbarian_1.default)(city.player())), new Effect_1.default((city, Item) => new Criterion_1.default(() => Item ===
        (0, exports.barbarianUnit)(city.player(), playerResearchRegistry, unitRegistry)))),
];
exports.getRules = getRules;
exports.default = exports.getRules;
//# sourceMappingURL=build.js.map
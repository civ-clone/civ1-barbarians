import { BarbarianActivity } from '../lib/activity';
import Rule from '@civ-clone/core-rule/Rule';
/**
 * How active the barbarians are (civ-clone/web-renderer#1008): the numbers the sea landings, the uprisings and their
 *  onset are played by (`lib/activity`). This package registers none, so it plays v474.05's (`CLASSIC_ACTIVITY`); a
 *  rule set that offers a choice of level, as `civ1-enhanced`'s does, answers with that level's numbers.
 */
export declare class Activity extends Rule<[], BarbarianActivity> {}
export default Activity;

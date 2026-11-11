import Defeated from '@civ-clone/core-unit/Rules/Defeated';
import { RansomGame } from '../../lib/ransom';
/**
 * Ransom (civ-clone/web-renderer#171): a barbarian leader (the group's Diplomat) who defends and loses pays the
 * civilization that beat him 100 gold. As v474.05 (`BATTLE.C` `battle()`): only the unit that defended is looked at,
 * so a leader killed in a stack that another unit defended pays nothing, a leader who defends his stack pays, and a
 * leader who attacks and loses pays nothing (civ-clone/web-renderer#954). `civ1-enhanced` has a rule that pays for a
 * leader killed in a stack too, and takes this one's place while it is in force.
 */
export declare const getRules: (game: RansomGame) => Defeated[];
export default getRules;

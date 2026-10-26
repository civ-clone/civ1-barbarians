import Destroyed from '@civ-clone/core-unit/Rules/Destroyed';
import { Game } from '@civ-clone/core-game';
export declare const RANSOM = 100;
/**
 * Ransom (civ-clone/web-renderer#171): a barbarian leader (the group's Diplomat) killed by a civilization pays it 100
 * gold. On `Destroyed` rather than `Defeated`, so a leader killed in a stack pays too: the units dying with a defender
 * are only destroyed. Dom, 2026-10-23, against v474.05, where only a lone leader pays. Disbanding passes no player,
 * so a leader who gives up pays nothing.
 */
export declare const getRules: (
  game: Pick<Game, 'engine' | 'playerTreasuries'>
) => Destroyed[];
export default getRules;

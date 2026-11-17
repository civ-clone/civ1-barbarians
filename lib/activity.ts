import Activity from '../Rules/Activity';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';

/**
 * The numbers the barbarians are played by (civ-clone/web-renderer#1008). This package reads them and owns only
 *  v474.05's (`CLASSIC_ACTIVITY`); another package that offers other levels gives their numbers through `Activity`
 *  rules.
 */
export type BarbarianActivity = {
  /**
   * The first turn barbarians may appear is (5 − level) × this, in v474.05's count: 30 there, so 150 on Chieftain and
   *  30 on Emperor. `Infinity` for never: no sea landing or uprising, while a goody hut still releases a horde.
   */
  onset: number;
  /** A sea landing every this many turns: 8 in v474.05. 0 for none. */
  landingEvery: number;
  /** The raiders at sea grow by one every this many turns, from 1 to 3: 150 in v474.05. */
  raidersEvery: number;
  /**
   * Added to each group: to the raiders at sea, up to the 3 a Frigate holds with their leader, and to an uprising. 0
   *  in v474.05.
   */
  extra: number;
  /** An uprising's chance is its city's gold in 100, times this: 1 in v474.05. 0 for none. */
  uprisingChance: number;
};

/** v474.05's numbers, played when no `Activity` rule answers. */
export const CLASSIC_ACTIVITY: Readonly<BarbarianActivity> = Object.freeze({
  onset: 30,
  landingEvery: 8,
  raidersEvery: 150,
  extra: 0,
  uprisingChance: 1,
});

/**
 * The numbers the barbarians play by in a game: the first `Activity` rule's answer, or v474.05's when none answers (no
 *  rule registered, or none switched on).
 */
export const activityOf = (rules: RuleRegistry): BarbarianActivity => {
  const [answer] = rules
    .process(Activity)
    .filter(
      (answer: BarbarianActivity | undefined): boolean =>
        answer !== undefined && answer !== null
    );

  return answer ?? CLASSIC_ACTIVITY;
};

export default activityOf;

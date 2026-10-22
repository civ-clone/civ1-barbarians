import Rule from '@civ-clone/core-rule/Rule';
import Turn from '@civ-clone/core-turn-based-game/Turn';

/**
 * Whether barbarians may appear this turn. Every `Spawning` rule has to pass before a landing or an uprising is tried,
 * so a variant can change the gate (`Rules/Turn/spawning`) or add one of its own.
 */
export class Spawning extends Rule<[Turn], boolean> {}

export default Spawning;

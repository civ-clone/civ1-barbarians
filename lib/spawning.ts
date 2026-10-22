import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Spawning from '../Rules/Spawning';
import Turn from '@civ-clone/core-turn-based-game/Turn';

// Whether every `Spawning` rule allows barbarians this turn. With none registered there is no gate.
export const spawning = (ruleRegistry: RuleRegistry, turn: Turn): boolean =>
  ruleRegistry.process(Spawning, turn).every(Boolean);

export default spawning;

import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import NavalTransport from '@civ-clone/base-unit-type-naval-transport/NavalTransport';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
export declare const createUnit: (
  UnitType: typeof Unit,
  player: Player,
  tile: Tile,
  ruleRegistry: RuleRegistry
) => Unit;
/**
 * A group of barbarians on `tile`, one of each of `types` in order. Aboard `transport` when given, as the raiders a
 * ship brings are: stowed and inactive until it lands them, like units that embarked.
 */
export declare const spawnUnits: (
  player: Player,
  tile: Tile,
  types: (typeof Unit)[],
  ruleRegistry: RuleRegistry,
  transport?: NavalTransport | null
) => Unit[];
export default spawnUnits;

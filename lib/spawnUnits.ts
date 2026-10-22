import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import NavalTransport from '@civ-clone/base-unit-type-naval-transport/NavalTransport';
import Player from '@civ-clone/core-player/Player';
import Stowed from '@civ-clone/base-unit-action-embark/Busy/Stowed';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

type UnitConstructor = new (
  city: null,
  player: Player,
  tile: Tile,
  ruleRegistry: RuleRegistry
) => Unit;

export const createUnit = (
  UnitType: typeof Unit,
  player: Player,
  tile: Tile,
  ruleRegistry: RuleRegistry
): Unit =>
  new (UnitType as unknown as UnitConstructor)(
    null,
    player,
    tile,
    ruleRegistry
  );

/**
 * A group of barbarians on `tile`, one of each of `types` in order. Aboard `transport` when given, as the raiders a
 * ship brings are: stowed and inactive until it lands them, like units that embarked. One the ship can't take (a
 * variant's capacity or `CanStow` rules) is removed again rather than left asleep at sea.
 */
export const spawnUnits = (
  player: Player,
  tile: Tile,
  types: (typeof Unit)[],
  ruleRegistry: RuleRegistry,
  transport: NavalTransport | null = null
): Unit[] =>
  types.flatMap((UnitType: typeof Unit): Unit[] => {
    const unit = createUnit(UnitType, player, tile, ruleRegistry);

    if (transport !== null) {
      if (!transport.stow(unit, tile)) {
        unit.destroy();

        return [];
      }

      unit.setBusy(new Stowed());
      unit.setActive(false);
    }

    return [unit];
  });

export default spawnUnits;

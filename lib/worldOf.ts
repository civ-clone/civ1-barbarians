import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import City from '@civ-clone/core-city/City';
import World from '@civ-clone/core-world/World';

// The world the game is played on, from any city or unit in it: a `Game` holds no world of its own, and the rules here
//  run long after it was built. `null` before anything is on the map, when there is nothing to raid anyway.
export const worldOf = ({
  cities,
  units,
}: {
  cities: Pick<CityRegistry, 'entries'>;
  units: Pick<UnitRegistry, 'entries'>;
}): World | null => {
  const city = cities
      .entries()
      .find((city: City): boolean => !city.destroyed()),
    [unit] = units.entries();

  return (city ?? unit)?.tile().map() ?? null;
};

export default worldOf;

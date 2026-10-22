import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import World from '@civ-clone/core-world/World';
export declare const worldOf: ({
  cities,
  units,
}: {
  cities: Pick<CityRegistry, 'entries'>;
  units: Pick<UnitRegistry, 'entries'>;
}) => World | null;
export default worldOf;

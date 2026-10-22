import { CityGrowthRegistry } from '@civ-clone/core-city-growth/CityGrowthRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import City from '@civ-clone/core-city/City';
export type CityGoldDependencies = {
  cities: Pick<CityRegistry, 'getByPlayer'>;
  cityGrowth: Pick<CityGrowthRegistry, 'getByCity'>;
  playerTreasuries: Pick<PlayerTreasuryRegistry, 'getByPlayerAndType'>;
};
/**
 * What a city is worth to a raider: its owner's gold, shared out among its citizens (v474.05 `Actions.cs`
 * `F0_2459_0687_GetCityTreasury`: gold × size ÷ (the owner's citizens + 1), in whole gold). It sets a city's chance of
 * an uprising and which city a raiding ship sails for.
 */
export declare const cityGold: (
  city: City,
  { cities, cityGrowth, playerTreasuries }: CityGoldDependencies
) => number;
export default cityGold;

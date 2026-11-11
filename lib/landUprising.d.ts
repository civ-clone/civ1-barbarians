import { BarbarianPlayerGame } from './barbarianPlayer';
import City from '@civ-clone/core-city/City';
import { Game } from '@civ-clone/core-game';
import Unit from '@civ-clone/core-unit/Unit';
export type LandUprisingGame = BarbarianPlayerGame &
  Pick<
    Game,
    | 'cities'
    | 'cityGrowth'
    | 'landMasses'
    | 'playerResearch'
    | 'playerTreasuries'
    | 'units'
  >;
export declare const uprisingSize: (citySize: number, roll: number) => number;
export declare const uprisingUnits: (
  count: number,
  industrial: boolean
) => (typeof Unit)[];
/**
 * A turn's chance of an uprising on land, as v474.05's (civd `TURN.C` `uprising()`): one of 128 city slots is drawn,
 * and a city there that `rises` may rise with a chance of its gold in 100. The square is found by up to 99 tries within
 * 6 of the city, each re-centred on the city nearest the last try: empty land on that city's land mass, at least 6 from
 * it, with no civilization's unit next to it. The group is sized by that city. Which cities may rise is the rule's:
 * whichever rule raises an uprising does so through this, so the units and `barbarians:uprising` are the same
 * (civ-clone/web-renderer#954).
 */
export declare const landUprising: (
  game: LandUprisingGame,
  rises: (city: City) => boolean
) => void;
export default landUprising;

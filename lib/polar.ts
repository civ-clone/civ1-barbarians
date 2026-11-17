import Tile from '@civ-clone/core-world/Tile';
import base, {
  polarRows as basePolarRows,
} from '@civ-clone/base-barbarians/lib/polar';

// v474.05's map has 50 rows: a raiding ship appears no nearer than 3 rows to either edge, and a barbarian within 2 rows
//  of one leaves the map. The same share of our map's height.
export const MAP_ROWS = 50;

export const polarRows = (height: number, rows: number): number =>
  basePolarRows(height, rows, MAP_ROWS);

export const nearPole = (tile: Tile, rows: number): boolean =>
  base(tile, rows, MAP_ROWS);

export default nearPole;

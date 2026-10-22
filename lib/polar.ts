import Tile from '@civ-clone/core-world/Tile';

// v474.05's map has 50 rows: a raiding ship appears no nearer than 3 rows to either edge, and a barbarian within 2 rows
//  of one leaves the map. The same share of our map's height.
export const polarRows = (height: number, rows: number): number =>
  Math.round((height * rows) / 50);

export const nearPole = (tile: Tile, rows: number): boolean => {
  const height = tile.map().height(),
    margin = polarRows(height, rows);

  return tile.y() < margin || tile.y() >= height - margin;
};

export default nearPole;

import Tile from '@civ-clone/core-world/Tile';

// Whether the body of water `tile` is in has at least `size` squares: a raiding ship appears on a sea, not a lake
//  (v474.05 asks for 16). The search stops as soon as it has seen enough.
export const waterBodyHasAtLeast = (tile: Tile, size: number): boolean => {
  if (!tile.isWater()) {
    return false;
  }

  const seen = new Set<Tile>([tile]),
    queue: Tile[] = [tile];

  while (queue.length > 0 && seen.size < size) {
    queue
      .shift()!
      .getNeighbours()
      .forEach((neighbour: Tile): void => {
        if (neighbour.isWater() && !seen.has(neighbour)) {
          seen.add(neighbour);
          queue.push(neighbour);
        }
      });
  }

  return seen.size >= size;
};

export default waterBodyHasAtLeast;

import Captured from '@civ-clone/core-city/Rules/Captured';
import { Game } from '@civ-clone/core-game';
export declare const BURNS_AT_ATTACK = 2;
/**
 * Barbarians too weak to hold a city burn it (civ-clone/web-renderer#171, v474.05 `Actions.cs` 21–78): taken by a
 * Horseman or a Musketman, it is destroyed; by anything stronger, it is captured as usual. Low priority, so it is
 * destroyed once the usual capture has run. A size-1 city is already destroyed by then (`civ1-city`'s shrink), and is
 * left alone: that is checked in the effect, as every criterion is checked before any rule's effect runs.
 */
export declare const getRules: (game: Pick<Game, 'units'>) => Captured[];
export default getRules;

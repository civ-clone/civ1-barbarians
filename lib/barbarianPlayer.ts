import addPlayer, { AddPlayerGame } from '@civ-clone/civ1-player/lib/addPlayer';
import { Anarchy } from '@civ-clone/civ1-government/Governments';
import { Attila } from '@civ-clone/base-civilization-barbarian/Leaders';
import Barbarian from '@civ-clone/base-civilization-barbarian/Barbarian';
import { Game } from '@civ-clone/core-game';
import Player from '@civ-clone/core-player/Player';
import World from '@civ-clone/core-world/World';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';

export type BarbarianPlayerGame = AddPlayerGame &
  Pick<Game, 'playerGovernments'>;

// The rule that gives a new player its random starting advances. Barbarians never have an advance, and `Player`'s
//  `Added` rules run before its civilization is set, so the rule is held off while the barbarian player is added, as
//  `civ1-game-end`'s respawn does.
export const STARTING_ADVANCES_RULE =
  'civ1-science:player/added/starting-advances';

/**
 * The barbarian player, made at the first spawn (civ-clone/web-renderer#169) so that a new game and an old save take
 * the same path and nobody takes an empty turn before the barbarians are due.
 *
 * It claims `Barbarian` and `Attila` through `addPlayer`, which wants both in the registries and takes them out again,
 * so they are registered just for that: they are never offered to anyone else. `player:spawned` is emitted for the
 * host to give it its client. Its government is set to Anarchy, which it never leaves: no taxes, no science and no
 * upkeep, and production as usual. A revolution is never offered in Anarchy, and only a Democracy's civil disorder
 * starts one.
 */
export const barbarianPlayer = (
  game: BarbarianPlayerGame,
  world: World
): Player => {
  const existing = game.players
    .entries()
    .find((player: Player): boolean => isBarbarian(player));

  if (existing) {
    return existing;
  }

  const startingAdvances = game.rules.getById(STARTING_ADVANCES_RULE),
    startingAdvancesEnabled = startingAdvances?.enabled() ?? false;

  if (!game.civilizations.includes(Barbarian)) {
    game.civilizations.register(Barbarian);
  }

  if (!game.leaders.includes(Attila)) {
    game.leaders.register(Attila);
  }

  startingAdvances?.disable();

  let player: Player;

  try {
    player = addPlayer(game, world, {
      civilization: Barbarian,
      leader: Attila,
    });
  } finally {
    if (startingAdvancesEnabled) {
      startingAdvances!.enable();
    }

    if (game.civilizations.includes(Barbarian)) {
      game.civilizations.unregister(Barbarian);
    }

    if (game.leaders.includes(Attila)) {
      game.leaders.unregister(Attila);
    }
  }

  game.playerGovernments.getByPlayer(player).set(new Anarchy());

  return player;
};

export default barbarianPlayer;

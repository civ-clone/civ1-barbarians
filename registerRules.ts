import { Game, defaultGame } from '@civ-clone/core-game';
import cityBuild from './Rules/City/build';
import turnSpawning from './Rules/Turn/spawning';
import turnStart from './Rules/Turn/start';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityBuild(game.players, game.playerResearch, game.rules),
    ...turnSpawning(game.difficulty),
    ...turnStart(game)
  );

// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
register(defaultGame);

export default register;

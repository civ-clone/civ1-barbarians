import { Game, defaultGame } from '@civ-clone/core-game';
import cityBuild from './Rules/City/build';
import cityCaptured from './Rules/City/captured';
import goodyHutBarbarians from './Rules/GoodyHut/barbarians';
import turnSpawning from './Rules/Turn/spawning';
import turnStart from './Rules/Turn/start';
import unitDestroyed from './Rules/Unit/destroyed';
import unitMoved from './Rules/Unit/moved';

export const register = (game: Game): void =>
  game.rules.register(
    ...cityBuild(game.players, game.playerResearch, game.rules),
    ...cityCaptured(game),
    ...goodyHutBarbarians(game),
    ...turnSpawning(game.difficulty),
    ...turnStart(game),
    ...unitDestroyed(game),
    ...unitMoved(game)
  );

// The plugin loader imports each package for this side effect, as it does `registerRules` elsewhere.
register(defaultGame);

export default register;

import {
  Battleship,
  Cannon,
  Chariot,
  Diplomat,
  Frigate,
  Horseman,
  Knight,
  Musketman,
  Sail,
  Settlers,
  Swordman,
  Warrior,
} from '@civ-clone/civ1-unit/Units';
import { Chieftain, Emperor } from '@civ-clone/civ1-difficulty/Difficulties';
import { Grassland, Ocean } from '@civ-clone/civ1-world/Terrains';
import { raidersAtSea, uprisingSize, uprisingUnits } from '../Rules/Turn/start';
import { instance as advanceRegistryInstance } from '@civ-clone/core-science/AdvanceRegistry';
import { instance as attributeRegistryInstance } from '@civ-clone/core-civilization/AttributeRegistry';
import { instance as availableGovernmentRegistryInstance } from '@civ-clone/core-government/AvailableGovernmentRegistry';
import { instance as cityNameRegistryInstance } from '@civ-clone/core-civilization/CityNameRegistry';
import { instance as terrainRegistryInstance } from '@civ-clone/core-terrain/TerrainRegistry';
import { instance as traitRegistryInstance } from '@civ-clone/core-civilization/TraitRegistry';
import Added from '@civ-clone/core-player/Rules/Added';
import { Anarchy } from '@civ-clone/civ1-government/Governments';
import Automobile from '@civ-clone/base-science-advance-automobile/Automobile';
import Barbarian from '@civ-clone/base-civilization-barbarian/Barbarian';
import Chivalry from '@civ-clone/base-science-advance-chivalry/Chivalry';
import { BarbariansGame } from '../Rules/Turn/start';
import City from '@civ-clone/core-city/City';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import CurrentPlayerRegistry from '@civ-clone/core-player/CurrentPlayerRegistry';
import Build from '@civ-clone/core-city-build/Rules/Build';
import CivilizationRegistry from '@civ-clone/core-civilization/CivilizationRegistry';
import Created from '@civ-clone/core-unit/Rules/Created';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Explosives from '@civ-clone/base-science-advance-explosives/Explosives';
import GameDifficultyRegistry from '@civ-clone/core-difficulty/GameDifficultyRegistry';
import Generator from '@civ-clone/civ1-player/tests/lib/Generator';
import Industrialization from '@civ-clone/base-science-advance-industrialization/Industrialization';
import LandMassRegistry from '@civ-clone/core-world/LandMassRegistry';
import LeaderRegistry from '@civ-clone/core-civilization/LeaderRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerGovernment from '@civ-clone/core-government/PlayerGovernment';
import PlayerGovernmentRegistry from '@civ-clone/core-government/PlayerGovernmentRegistry';
import PlayerRegistry from '@civ-clone/core-player/PlayerRegistry';
import PlayerResearch from '@civ-clone/core-science/PlayerResearch';
import PlayerResearchRegistry from '@civ-clone/core-science/PlayerResearchRegistry';
import PlayerWorldRegistry from '@civ-clone/core-player-world/PlayerWorldRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Start from '@civ-clone/core-turn-based-game/Rules/Start';
import Terrain from '@civ-clone/core-terrain/Terrain';
import Tile from '@civ-clone/core-world/Tile';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import WorkedTileRegistry from '@civ-clone/core-city/WorkedTileRegistry';
import World from '@civ-clone/core-world/World';
import cityBuild, { availableToBarbarians } from '../Rules/City/build';
import cityGold from '../lib/cityGold';
import { expect } from 'chai';
import { firstSpawnTurn } from '../Rules/Turn/spawning';
import { generateWorld } from '@civ-clone/core-world/tests/lib/buildWorld';
import isBarbarian from '@civ-clone/base-civilization-barbarian/isBarbarian';
import { nearPole, polarRows } from '../lib/polar';
import registerRules from '../registerRules';
import unitYields from '@civ-clone/civ1-unit/Rules/Unit/yield';
import waterBodyHasAtLeast from '../lib/waterBody';

// A 30 × 30 world: land in the top half, sea in the bottom. A cheap stand-in for a game: real registries and rules
//  enough to add a player and create units, and the rest faked where a formula reads it.
type TestGame = BarbariansGame & {
  rolls: number[];
  sizes: Map<City, number>;
  gold: Map<Player, number>;
  world: World;
  spawnedEvents: unknown[][];
};

const createGame = async (): Promise<TestGame> => {
  const rules = new RuleRegistry(),
    landMasses = new LandMassRegistry(),
    width = 30,
    height = 30,
    world = await generateWorld(
      new Generator(
        height,
        width,
        (i: number): Terrain =>
          new ((Math.floor(i / width) < 15
            ? Grassland
            : Ocean) as unknown as new () => Terrain)(),
        {},
        rules,
        terrainRegistryInstance
      ),
      rules,
      landMasses
    ),
    engine = new Engine(),
    sizes = new Map<City, number>(),
    gold = new Map<Player, number>(),
    spawnedEvents: unknown[][] = [],
    rolls: number[] = [],
    game = {
      attributes: attributeRegistryInstance,
      cities: new CityRegistry(),
      cityGrowth: {
        getByCity: (city: City) => ({ size: () => sizes.get(city) ?? 1 }),
      },
      cityNames: cityNameRegistryInstance,
      civilizations: new CivilizationRegistry(),
      currentPlayers: new CurrentPlayerRegistry(),
      difficulty: new GameDifficultyRegistry(),
      engine,
      landMasses,
      leaders: new LeaderRegistry(),
      playerGovernments: new PlayerGovernmentRegistry(),
      playerResearch: new PlayerResearchRegistry(),
      playerTreasuries: {
        getByPlayerAndType: (player: Player) => ({
          value: () => gold.get(player) ?? 0,
        }),
      },
      playerWorlds: new PlayerWorldRegistry(),
      players: new PlayerRegistry(),
      rng: (): number => (rolls.length > 0 ? rolls.shift()! : 0.5),
      rules,
      traits: traitRegistryInstance,
      turn: new Turn(),
      units: new UnitRegistry(),
      rolls,
      sizes,
      gold,
      world,
      spawnedEvents,
    } as unknown as TestGame;

  rules.register(
    new Added(
      new Effect((player: Player): void => {
        game.playerGovernments.register(
          new PlayerGovernment(
            player,
            availableGovernmentRegistryInstance,
            rules
          )
        );
        game.playerResearch.register(
          new PlayerResearch(player, advanceRegistryInstance, rules)
        );
      })
    ),
    new Created(new Effect((unit: Unit): void => game.units.register(unit)))
  );

  registerRules(game as any);

  // A ship's capacity, and so whether it takes its raiders aboard, comes from civ1-unit's yield rules.
  rules.register(...unitYields(undefined, rules));

  [
    'player:spawned',
    'barbarians:raiders-at-sea',
    'barbarians:uprising',
  ].forEach((event: string): void => {
    engine.on(event, (...args: unknown[]): void => {
      spawnedEvents.push([event, ...args]);
    });
  });

  return game;
};

const addCivilization = (
  game: TestGame,
  cityAt: [number, number] | null = null,
  { size = 4, treasury = 100 }: { size?: number; treasury?: number } = {}
): { player: Player; city: City | null } => {
  const player = new Player(game.rules);

  game.players.register(player);
  game.gold.set(player, treasury);

  if (cityAt === null) {
    return { player, city: null };
  }

  const city = new City(
    player,
    game.world.get(...cityAt),
    'Test',
    game.rules,
    new WorkedTileRegistry()
  );

  game.cities.register(city);
  game.sizes.set(city, size);

  return { player, city };
};

const startTurn = (game: TestGame, turn: number): void => {
  game.turn.set(turn);
  game.rules.process(Start, game.turn);
};

const barbariansOf = (game: TestGame): Player | undefined =>
  game.players.entries().find((player: Player) => isBarbarian(player));

const events = (game: TestGame, name: string): unknown[][] =>
  game.spawnedEvents.filter(([event]) => event === name);

describe('the gate', (): void => {
  it('opens on turn (5 - level) × 30', (): void => {
    expect([0, 1, 2, 3, 4].map(firstSpawnTurn)).to.eql([150, 120, 90, 60, 30]);
  });

  it('lets nothing land before turn 150 on Chieftain, nor before 30 on Emperor', async (): Promise<void> => {
    for (const [Level, before, after] of [
      [Chieftain, 151, 153],
      [Emperor, 31, 33],
    ] as [typeof Chieftain, number, number][]) {
      const game = await createGame();

      game.difficulty.set(Level);
      addCivilization(game, [5, 5]);

      startTurn(game, before);

      expect(barbariansOf(game), `${Level.name} turn ${before}`).to.be
        .undefined;

      game.rolls.push(0, 0.999);
      startTurn(game, after);

      expect(barbariansOf(game), `${Level.name} turn ${after}`).not.to.be
        .undefined;
      expect(events(game, 'barbarians:raiders-at-sea')).to.have.length(1);
    }
  });

  it('is a rule a variant can take away', async (): Promise<void> => {
    const game = await createGame();

    game.difficulty.set(Chieftain);
    addCivilization(game, [5, 5]);
    game.rules.getById('civ1-barbarians:spawning/from-turn')!.disable();

    game.rolls.push(0, 0.999);
    startTurn(game, 9);

    expect(events(game, 'barbarians:raiders-at-sea')).to.have.length(1);
  });
});

describe('sea landings', (): void => {
  it('come every 8th turn, not between', async (): Promise<void> => {
    const game = await createGame();

    game.difficulty.set(Emperor);
    addCivilization(game, [5, 5]);

    for (const turn of [34, 35, 36, 37, 38, 39, 40]) {
      game.rolls.push(0.999);
      startTurn(game, turn);
    }

    expect(events(game, 'barbarians:raiders-at-sea')).to.have.length(0);

    game.rolls.push(0, 0.999);
    startTurn(game, 41);

    expect(events(game, 'barbarians:raiders-at-sea')).to.have.length(1);
  });

  it('stop once anyone has Automobile', async (): Promise<void> => {
    const game = await createGame(),
      { player } = addCivilization(game, [5, 5]);

    game.difficulty.set(Emperor);
    game.playerResearch.getByPlayer(player).addAdvance(Automobile);

    game.rolls.push(0, 0.999);
    startTurn(game, 41);

    expect(events(game, 'barbarians:raiders-at-sea')).to.have.length(0);
    expect(barbariansOf(game)).to.be.undefined;
  });

  it('bring a Sail with Swordmen and a Diplomat aboard, clear of the poles, on a real sea', async (): Promise<void> => {
    const game = await createGame();

    game.difficulty.set(Emperor);
    addCivilization(game, [5, 5]);

    game.rolls.push(0, 0.999);
    startTurn(game, 41);

    const [[, player, ship, tile]] = events(
        game,
        'barbarians:raiders-at-sea'
      ) as [string, Player, Unit, Tile][],
      units = game.units.getByPlayer(player),
      cargo = units.filter((unit: Unit) => unit !== ship);

    expect(isBarbarian(player)).to.be.true;
    expect(ship).to.be.instanceOf(Sail);
    expect(tile.isWater()).to.be.true;
    expect(tile.y()).to.be.at.least(polarRows(30, 3));
    expect(waterBodyHasAtLeast(tile, 16)).to.be.true;
    // Turn 41 is count 39: 1 raider.
    expect(cargo.map((unit: Unit) => unit.constructor)).to.eql([
      Swordman,
      Diplomat,
    ]);
    expect(cargo.every((unit: Unit) => !unit.active())).to.be.true;
    expect(cargo.every((unit: Unit) => unit.tile() === tile)).to.be.true;
    expect((ship as any).cargo()).to.have.members(cargo);
  });

  it('bring a Frigate of Knights from turn 300 once anyone has Explosives', async (): Promise<void> => {
    const game = await createGame(),
      { player: civilization } = addCivilization(game, [5, 5]);

    game.difficulty.set(Emperor);
    game.playerResearch.getByPlayer(civilization).addAdvance(Explosives);

    game.rolls.push(0, 0.999);
    startTurn(game, 305);

    const [[, player, ship]] = events(game, 'barbarians:raiders-at-sea') as [
      string,
      Player,
      Unit
    ][];

    expect(ship).to.be.instanceOf(Frigate);
    expect(
      game.units
        .getByPlayer(player)
        .filter((unit: Unit) => unit !== ship)
        .map((unit: Unit) => unit.constructor)
    ).to.eql([Knight, Knight, Knight, Diplomat]);
  });

  it('are sized by the turn', (): void => {
    expect([0, 149, 150, 299, 300, 600].map(raidersAtSea)).to.eql([
      1, 1, 2, 2, 3, 3,
    ]);
  });
});

describe('land uprisings', (): void => {
  it("rise near any civilization's city, at least 6 away on its land mass, with Horsemen and a Diplomat", async (): Promise<void> => {
    const game = await createGame(),
      { player: civilization, city } = addCivilization(game, [5, 5], {
        size: 4,
        treasury: 100,
      });

    game.difficulty.set(Emperor);

    // Slot 0 (the city), a chance roll of 0 against gold 80, then one try: x + 6, y + 0, and a group roll of 0.9.
    game.rolls.push(0, 0, 12.5 / 13, 6.5 / 13, 0.9);
    startTurn(game, 34);

    const [[, player, target, tile, guerrilla]] = events(
        game,
        'barbarians:uprising'
      ) as [string, Player, City, Tile, boolean][],
      units = game.units.getByPlayer(player);

    expect(isBarbarian(player)).to.be.true;
    expect(player).not.to.equal(civilization);
    expect(target).to.equal(city);
    expect([tile.x(), tile.y()]).to.eql([11, 5]);
    expect(tile.distanceFrom(city!.tile())).to.be.at.least(6);
    expect(game.landMasses.getByTile(tile)).to.equal(
      game.landMasses.getByTile(city!.tile())
    );
    expect(guerrilla).to.be.false;
    expect(units.map((unit: Unit) => unit.constructor)).to.eql([
      Horseman,
      Horseman,
      Diplomat,
    ]);
    expect(units.every((unit: Unit) => unit.tile() === tile)).to.be.true;
  });

  it("are a chance of the city's gold in 100, drawn from 128 slots", async (): Promise<void> => {
    const game = await createGame();

    addCivilization(game, [5, 5], { size: 4, treasury: 100 });
    game.difficulty.set(Emperor);

    // Slot 1 of 128: no city there.
    game.rolls.push(1.5 / 128, 0.999);
    startTurn(game, 34);

    expect(events(game, 'barbarians:uprising')).to.have.length(0);

    // Slot 0, but a roll of 80 against gold 80.
    game.rolls.push(0, 0.8, 0.999);
    startTurn(game, 35);

    expect(events(game, 'barbarians:uprising')).to.have.length(0);
    expect(barbariansOf(game)).to.be.undefined;
  });

  it('are Musketmen and Cannon in fours once anyone has Industrialization', (): void => {
    expect(uprisingUnits(10, false)).to.eql([
      Horseman,
      Horseman,
      Horseman,
      Horseman,
      Chariot,
      Chariot,
      Chariot,
      Chariot,
      Horseman,
      Diplomat,
    ]);
    expect(uprisingUnits(6, true)).to.eql([
      Musketman,
      Musketman,
      Musketman,
      Musketman,
      Cannon,
      Diplomat,
    ]);
  });

  it('are at least 3 strong, and grow with the city', (): void => {
    expect(uprisingSize(1, 0.99)).to.equal(3);
    expect(uprisingSize(4, 0.99)).to.equal(3);
    expect(uprisingSize(12, 0.99)).to.equal(6);
    expect(uprisingSize(12, 0)).to.equal(3);
  });

  it('say so when the world has Industrialization', async (): Promise<void> => {
    const game = await createGame(),
      { player: civilization } = addCivilization(game, [5, 5], {
        size: 4,
        treasury: 100,
      });

    game.difficulty.set(Emperor);
    game.playerResearch.getByPlayer(civilization).addAdvance(Industrialization);
    game.rolls.push(0, 0, 12.5 / 13, 6.5 / 13, 0.9);
    startTurn(game, 34);

    const [[, player, , , guerrilla]] = events(game, 'barbarians:uprising') as [
      string,
      Player,
      City,
      Tile,
      boolean
    ][];

    expect(guerrilla).to.be.true;
    expect(
      game.units.getByPlayer(player).map((unit: Unit) => unit.constructor)
    ).to.eql([Musketman, Musketman, Diplomat]);
  });
});

describe('the barbarian player', (): void => {
  it('is made once, on Anarchy, with no advances, and leaves the registries empty', async (): Promise<void> => {
    const game = await createGame();

    game.difficulty.set(Emperor);
    addCivilization(game, [5, 5]);

    game.rolls.push(0, 0.999);
    startTurn(game, 41);
    game.rolls.push(0, 0.999);
    startTurn(game, 49);

    const barbarians = game.players
      .entries()
      .filter((player: Player) => isBarbarian(player));

    expect(barbarians).to.have.length(1);
    expect(events(game, 'player:spawned')).to.have.length(1);

    const [player] = barbarians;

    expect(player.civilization()).to.be.instanceOf(Barbarian);
    expect(player.civilization().leader()!.name()).to.equal('Attila');
    expect(game.playerGovernments.getByPlayer(player).is(Anarchy)).to.be.true;
    expect(game.playerResearch.getByPlayer(player).complete()).to.have.length(
      0
    );
    expect(game.civilizations.length).to.equal(0);
    expect(game.leaders.length).to.equal(0);
    expect(game.playerWorlds.getByPlayer(player)).not.to.be.undefined;
    expect(events(game, 'barbarians:raiders-at-sea')).to.have.length(2);
  });

  it('joins the turn under way, last, so its first raiders move at once', async (): Promise<void> => {
    const game = await createGame(),
      { player: civilization } = addCivilization(game, [5, 5]);

    game.difficulty.set(Emperor);
    game.currentPlayers.register(civilization);

    game.rolls.push(0, 0.999);
    startTurn(game, 41);

    expect(game.currentPlayers.entries()).to.eql([
      civilization,
      barbariansOf(game),
    ]);
  });

  it('is left for the turn to queue when none is under way', async (): Promise<void> => {
    const game = await createGame();

    addCivilization(game, [5, 5]);
    game.difficulty.set(Emperor);

    game.rolls.push(0, 0.999);
    startTurn(game, 41);

    expect(game.currentPlayers.length).to.equal(0);
  });
});

describe('cityGold', (): void => {
  it("shares the owner's gold among its citizens, in whole gold", (): void => {
    const player = {} as Player,
      big = { player: () => player } as unknown as City,
      small = { player: () => player } as unknown as City,
      sizes = new Map<City, number>([
        [big, 6],
        [small, 3],
      ]),
      dependencies = {
        cities: { getByPlayer: () => [big, small] },
        cityGrowth: {
          getByCity: (city: City) => ({ size: () => sizes.get(city)! }),
        },
        playerTreasuries: { getByPlayerAndType: () => ({ value: () => 100 }) },
      };

    // 100 × 6 ÷ 10 and 100 × 3 ÷ 10.
    expect(cityGold(big, dependencies as any)).to.equal(60);
    expect(cityGold(small, dependencies as any)).to.equal(30);
  });
});

describe('the poles', (): void => {
  it("are the same share of the map as v474.05's rows", (): void => {
    expect(polarRows(50, 3)).to.equal(3);
    expect(polarRows(50, 2)).to.equal(2);
    expect(polarRows(100, 3)).to.equal(6);
    expect(polarRows(30, 2)).to.equal(1);
  });

  it('are where a tile is near', (): void => {
    const map = { height: () => 50 },
      tile = (y: number) => ({ map: () => map, y: () => y } as unknown as Tile);

    expect(nearPole(tile(0), 2)).to.be.true;
    expect(nearPole(tile(1), 2)).to.be.true;
    expect(nearPole(tile(2), 2)).to.be.false;
    expect(nearPole(tile(47), 2)).to.be.false;
    expect(nearPole(tile(48), 2)).to.be.true;
  });
});

describe('what a barbarian city builds', (): void => {
  const rules = new RuleRegistry();

  rules.register(...unitYields(undefined, rules));

  const research = new Map<Player, (typeof Chivalry)[]>(),
    players = {
      entries: () => [...research.keys()],
    },
    playerResearch = {
      getByPlayer: (player: Player) => ({
        completed: (Advance: typeof Chivalry) =>
          research.get(player)!.includes(Advance),
      }),
    },
    available = (Item: any) =>
      availableToBarbarians(Item, players as any, playerResearch as any, rules);

  it('is an attacking unit at least two civilizations can build, never Settlers, a Diplomat or an improvement', (): void => {
    const a = {} as Player,
      b = {} as Player;

    research.set(a, [Chivalry]);
    research.set(b, []);

    expect(available(Warrior), 'Warrior needs nothing').to.be.true;
    expect(available(Settlers), 'Settlers').to.be.false;
    expect(available(Diplomat), 'Diplomat').to.be.false;
    expect(available(Knight), 'Knight: one civilization').to.be.false;
    expect(available(class Granary {}), 'an improvement').to.be.false;

    research.set(b, [Chivalry]);

    expect(available(Knight), 'Knight: two civilizations').to.be.true;
    expect(available(Battleship), 'a ship').to.be.false;
  });

  it('is the rule a barbarian city gets, and no other city', (): void => {
    const registry = new RuleRegistry(),
      barbarians = { civilization: () => new Barbarian() },
      civilization = { civilization: () => ({}) },
      cityOf = (player: unknown) => ({ player: () => player });

    registry.register(
      ...cityBuild(players as any, playerResearch as any, rules)
    );

    const [forBarbarians] = registry.process(
      Build,
      cityOf(barbarians) as any,
      Warrior as any
    );

    expect(forBarbarians.validate()).to.be.true;
    expect(
      registry
        .process(Build, cityOf(barbarians) as any, Battleship as any)[0]
        .validate()
    ).to.be.false;
    expect(
      registry.process(Build, cityOf(civilization) as any, Warrior as any)
    ).to.have.length(0);
  });
});

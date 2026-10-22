# civ1-barbarians

Civilization I's barbarians (civ-clone/web-renderer#169): raiding parties that land from the sea and uprisings that
break out in empty land near cities, from v474.05 (`GameEngine.cs` `F0_1238_0980_GenerateBarbarianUprising`).

The barbarian player is `base-civilization-barbarian`'s `Barbarian`, made by the first spawn through `civ1-player`'s
`addPlayer` (`lib/barbarianPlayer`). Its government is Anarchy for good, it has no advances and it is never offered
research. The host answers `player:spawned` with a client for it, as `simple-ai-client`'s `BarbarianClient` is.

## Rules

- `Spawning` (`Rules/Spawning`): whether barbarians may appear this turn. Every `Spawning` rule must pass. The one
  here, `civ1-barbarians:spawning/from-turn`, allows them from turn (5 − level) × 30 in v474.05's count: 150 on
  Chieftain, 30 on Emperor.
- `civ1-barbarians:turn/start/sea-landing`: every 8th turn, until anyone has Automobile, a Sail (a Frigate from turn
  300) appears on an empty square of a sea of at least 16 squares, clear of the poles, with 1 to 3 Swordmen (Knights
  once anyone has Explosives) and a Diplomat aboard. Emits `barbarians:raiders-at-sea` (player, ship, tile). Where it
  sails, and the landing, are the barbarian client's.
- `civ1-barbarians:turn/start/land-uprising`: each turn one of 128 city slots is drawn; an occupied one, of any
  civilization, rises with a chance of its gold in 100 (`lib/cityGold`: the owner's gold shared among its citizens).
  The square is found by up to 99 tries within 6 of the city, each re-centred on the nearest city: empty land on that
  city's land mass, at least 6 from it, with no civilization's unit next to it. max(⌊size ÷ 2 random⌋, 2) + 1 units:
  Horsemen and Chariots in fours (Musketmen and Cannon once anyone has Industrialization), the last a Diplomat. Emits
  `barbarians:uprising` (player, city, tile, guerrilla).
- `civ1-barbarians:city/build/raiders-only`: a barbarian city builds only units that attack, other than Settlers,
  Diplomats and Caravans, that at least two civilizations can build. Never an improvement or a Wonder. `civ1-unit`'s
  advance rules leave barbarian cities to this one.

Departures from v474.05, decided on civ-clone/web-renderer#27 and #169: uprisings threaten every civilization, not
only the human; the ship lands on the city's own continent. Combat multipliers, ransom, pillage, city burning and the
leader's fate are civ-clone/web-renderer#170 and #171; the goody-hut horde is #172.

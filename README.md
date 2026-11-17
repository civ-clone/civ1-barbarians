# civ1-barbarians

Civilization I's barbarians (civ-clone/web-renderer#169): raiding parties that land from the sea and uprisings that
break out in empty land near cities, from v474.05 (`GameEngine.cs` `F0_1238_0980_GenerateBarbarianUprising`).

The mechanism is `base-barbarians`' (the `Spawning` gate, the barbarian player, spawning a group, ransom, a city's
gold): this package keeps v474.05's numbers, units, terrain and polar rows, and its rule ids, and builds its rules on
those helpers. The old paths (`Rules/Spawning`, `lib/spawning`, `lib/spawnUnits`, `lib/cityGold`, `lib/anyoneHas`,
`lib/waterBody`, `lib/worldOf`) re-export them, so a rule registered from either path is the same kind of rule.

The barbarian player is `base-civilization-barbarian`'s `Barbarian`, made by the first spawn through base-barbarians'
`barbarianPlayer` (`lib/barbarianPlayer`), with `civ1-science`'s starting advances held off. Its government is Anarchy
for good, it has no advances and it is never offered research. The host answers `player:spawned` with a client for
it, as `simple-ai-client`'s `BarbarianClient` is. That client falls back to v474.05's leader (the Diplomat) and polar
exit (2 of 50 rows), so this package registers no `LeadsGroup` or `LeavesMap` rule.

## Activity

How active the barbarians are is a parameter (civ-clone/web-renderer#1008): `lib/activity`'s `activityOf(rules)` gives
the numbers the gate, the sea landings and the uprisings play by, from the first `Activity` rule (`Rules/Activity`) that
answers. This package registers none, so with nothing answering they are v474.05's, `CLASSIC_ACTIVITY`:

- `onset` 30: the first turn is (5 − level) × 30. `Infinity` lets no sea landing or uprising happen at all.
- `landingEvery` 8: a sea landing every 8th turn. 0 for none.
- `raidersEvery` 150: the raiders at sea grow by one every 150 turns, from 1 to 3.
- `extra` 0: added to the raiders at sea, up to the 3 a Frigate holds with their leader, and to an uprising.
- `uprisingChance` 1: an uprising's chance is its city's gold in 100, times this. 0 for none.

The ship is a Frigate whenever there are 3 raiders (from turn 300 at v474.05's numbers), so every raider and the leader
fit aboard. A goody hut's horde is the same at any level. `civ1-enhanced` offers a choice of levels, with their
numbers, as a rule set.

## Rules

- `Spawning` (`Rules/Spawning`): whether barbarians may appear this turn. Every `Spawning` rule must pass. The one
  here, `civ1-barbarians:spawning/from-turn`, allows them from turn (5 − level) × 30 in v474.05's count: 150 on
  Chieftain, 30 on Emperor (the activity level's onset in place of 30).
- `civ1-barbarians:turn/start/sea-landing`: every 8th turn, until anyone has Automobile, a Sail (a Frigate from turn
  300) appears on an empty square of a sea of at least 16 squares, clear of the poles, with 1 to 3 Swordmen (Knights
  once anyone has Explosives) and a Diplomat aboard. Emits `barbarians:raiders-at-sea` (player, ship, tile). Where it
  sails, and the landing, are the barbarian client's.
- `civ1-barbarians:turn/start/land-uprising`: each turn one of 128 city slots is drawn; an occupied one, as v474.05
  only the human's, rises with a chance of its gold in 100 (`lib/cityGold`: the owner's gold shared among its
  citizens). The square is found by up to 99 tries within 6 of the city, each re-centred on the nearest city: empty
  land on that city's land mass, at least 6 from it, with no civilization's unit next to it. It brings
  max(⌊size ÷ 2 random⌋, 2) + 1 units: Horsemen and Chariots in fours (Musketmen and Cannon once anyone has
  Industrialization), the last a Diplomat. Emits `barbarians:uprising` (player, city, tile, guerrilla).
  `lib/landUprising` raises it, and `civ1-enhanced` lets any civilization's city rise, superseding this rule while its
  set is on (civ-clone/web-renderer#954).
- `civ1-barbarians:goody-hut/barbarians/horde`: a goody hut's horde (civ-clone/web-renderer#172): round the hut's
  neighbours from the north, clockwise, stepping by clamp(4 − the player's cities, 1, 4), a Horseman on each free
  land square that isn't a city, or a Swordman on Mountains.
- `civ1-barbarians:city/build/raiders-only`: as v474.05, a barbarian city builds a Warrior while the barbarians have
  no unit, then Swordmen, and Knights once anyone has Explosives; nothing else. `civ1-unit`'s advance rules leave
  barbarian cities to this one. `civ1-enhanced` lets them build any attacking land unit two civilizations can build,
  superseding this rule while its set is on (civ-clone/web-renderer#954).
- `civ1-barbarians:unit/defeated/ransom`: a barbarian leader (the group's Diplomat) who defends and loses pays the
  civilization that beat him 100 gold (`lib/ransom`), and emits `barbarians:ransom` (player, leader, gold). As
  v474.05, only the defender counts: a leader killed in a stack another unit defended pays nothing.
  `civ1-enhanced` pays for those too, superseding this rule while its set is on (civ-clone/web-renderer#954).
- `civ1-barbarians:city/captured/burn`: barbarians whose strongest unit in a city they take attacks at 2 or less (a
  Horseman or a Musketman) burn it rather than hold it (civ-clone/web-renderer#171). Low priority, after the capture.
- `civ1-barbarians:unit/moved/pillage`: a barbarian Horseman, Chariot, Musketman or Cannon leaving a square outside a
  city that has irrigation or a mine, whose nearest city is a civilization's, destroys both through the `Pillaged`
  rules, and stops (civ-clone/web-renderer#171).

The human: v474.05's one human is, here, every player whose seat is not played by the computer (`civ1-difficulty`'s
`isHuman`: a player with a client, none of them an `AIClient`). In a game with no such seat (all computer players, or a
game only watched), the uprising rule never raises an uprising.

Departures from v474.05, decided on civ-clone/web-renderer#27 and #169: the ship lands on the city's own continent.
Where uprisings strike and what barbarian cities build differ only in `civ1-enhanced` (civ-clone/web-renderer#954).
Combat multipliers, ransom, pillage, city burning and the leader's fate are civ-clone/web-renderer#170 and #171; the
goody-hut horde is #172.

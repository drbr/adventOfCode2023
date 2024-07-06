const fs = require('fs');

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

const GIVEN_CUBES = {
  red: 12,
  green: 13,
  blue: 14,
};

function parseGame(line) {
  const outerMatches = line.match(/Game ([0-9]+): (.*)$/);
  const gameId = Number(outerMatches[1]);
  const rest = outerMatches[2];
  const experimentsRaw = rest.split(';').map((x) => x.trim());
  const experiments = experimentsRaw.map((x) => ({
    red: Number(x.match(/([0-9]+) red/)?.[1] ?? 0),
    green: Number(x.match(/([0-9]+) green/)?.[1] ?? 0),
    blue: Number(x.match(/([0-9]+) blue/)?.[1] ?? 0),
  }));
  return { gameId, experiments };
}

function bigger(a, b) {
  return Object.keys(a).reduce((x, k) => ({ ...x, [k]: Math.max(a[k], b[k]) }), {});
}

let total = 0;
for (const line of lines) {
  const { gameId, experiments } = parseGame(line);

  const gameHasAtLeastTheseCounts = experiments.reduce((r, x) => bigger(r, x), experiments[0]);

  const gameIsPossible = Object.keys(GIVEN_CUBES).every((k) => {
    return gameHasAtLeastTheseCounts[k] <= GIVEN_CUBES[k];
  });

  if (gameIsPossible) {
    total += gameId;
  }
}

console.log(total);

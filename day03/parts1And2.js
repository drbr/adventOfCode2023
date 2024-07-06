const fs = require('fs');

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

const numPattern = /[0-9]+/dg;
const symbolPattern = /[^0-9\.]/;

const partIdsAdjacentToGears = {};

function gearKey({ x, y }) {
  return `${y},${x}`;
}

function addToMap({ key, partId }) {
  const entry = partIdsAdjacentToGears[key] ?? [];
  entry.push(partId);
  partIdsAdjacentToGears[key] = entry;
}

function getAllValidGearRatios(map) {
  const ret = [];
  for (const a of Object.values(map)) {
    if (a.length == 2) {
      ret.push(a[0] * a[1]);
    }
  }
  return ret;
}

let partIdSum = 0;

for (let y = 0; y < lines.length; y++) {
  const allNumbers = lines[y].matchAll(numPattern);
  const allNumbersIndices = Array.from(allNumbers, (x) => x.indices);
  // console.log(JSON.stringify(allNumbersIndices));

  for (const indices of allNumbersIndices) {
    const [numStart, numEnd] = indices[0];
    const partId = Number(lines[y].substring(numStart, numEnd));
    const adjacentRanges = [
      { y: y, x: [numStart - 1, numStart] },
      { y: y, x: [numEnd, numEnd + 1] },
      { y: y - 1, x: [numStart - 1, numEnd + 1] },
      { y: y + 1, x: [numStart - 1, numEnd + 1] },
    ];
    // console.log(`Part ID: ${partId}`);
    // console.log(JSON.stringify(adjacentRanges));
    const hasAdjacentSymbol = adjacentRanges.some((r) => {
      const substr = lines[r.y]?.substring(r.x[0], r.x[1]) ?? '';
      return symbolPattern.test(substr);
    });

    // Find coördinates of adjacent gears and add to the adjacency list
    for (const { y, x } of adjacentRanges) {
      const [x1, x2] = x;
      for (let x = x1; x < x2; x++) {
        const char = lines[y]?.charAt(x) ?? '';
        if (char == '*') {
          const k = gearKey({ x, y });
          addToMap({ key: k, partId });
        }
      }
    }

    if (hasAdjacentSymbol) {
      partIdSum += partId;
    }
  }
}

console.log('Part 1: ' + partIdSum);

const gearRatios = getAllValidGearRatios(partIdsAdjacentToGears);
const gearRatioSum = gearRatios.reduce((sum, x) => x + sum, 0);
console.log('Part 2: ' + gearRatioSum);

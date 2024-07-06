const fs = require('fs');

const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

const numPattern = /[0-9]+/dg;
const symbolPattern = /[^0-9\.]/;

let partIdSum = 0;

for (let y = 0; y < lines.length; y++) {
  const allNumbers = lines[y].matchAll(numPattern);
  const allNumbersIndices = Array.from(allNumbers, (x) => x.indices);
  // console.log(JSON.stringify(allNumbersIndices));

  for (const indices of allNumbersIndices) {
    const [numStart, numEnd] = indices[0];
    const partId = Number(lines[y].substring(numStart, numEnd));
    const adjacentRanges = [
      lines[y].substring(numStart - 1, numStart),
      lines[y].substring(numEnd, numEnd + 1),
      lines[y - 1]?.substring(numStart - 1, numEnd + 1),
      lines[y + 1]?.substring(numStart - 1, numEnd + 1),
    ].filter(Boolean);
    // console.log(`Part ID: ${partId}`);
    // console.log(JSON.stringify(adjacentRanges));
    const hasAdjacentSymbol = adjacentRanges.some((x) => symbolPattern.test(x));

    if (hasAdjacentSymbol) {
      partIdSum += partId;
    }
  }
}

console.log(partIdSum);

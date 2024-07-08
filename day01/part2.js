const fs = require('fs');

// Actual program here
const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

function getDigits(line) {
  // console.log(line);

  // Use zero-width lookahead with capture group as described at:
  // https://stackoverflow.com/questions/20833295/how-can-i-match-overlapping-strings-with-regex
  matches = Array.from(
    line.matchAll(/(?=(zero|one|two|three|four|five|six|seven|eight|nine|0|1|2|3|4|5|6|7|8|9))/g),
    // Extract the first captured group from each match
    (x) => x[1]
  );
  // console.log(matches);

  const digitsMap = {
    zero: 0,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };

  const firstMatch = matches[0];
  const first = digitsMap[firstMatch] ?? firstMatch;

  const lastMatch = matches[matches.length - 1];
  const last = digitsMap[lastMatch] ?? lastMatch;

  return { first, last };
}

let total = 0;
for (line of lines) {
  if (line.trim() == '') {
    continue;
  }
  const { first, last } = getDigits(line);
  const num = parseInt(`${first}${last}`, 10);
  // console.log(num);
  total += num;
}

console.log(total);

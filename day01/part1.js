const fs = require('fs');

// Actual program here
const fileText = fs.readFileSync(process.argv[2], 'utf8');
const lines = fileText.split('\n');

function getDigits(line) {
  let matches = line.match(/([0-9])/g);
  const first = matches[0];
  const last = matches[matches.length - 1];
  return { first, last };
}

let total = 0;
for (line of lines) {
  if (line.trim() == '') {
    continue;
  }
  const { first, last } = getDigits(line);
  const num = parseInt(`${first}${last}`, 10);
  total += num;
}

console.log(total);

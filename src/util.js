const fs = require('fs');

module.exports = { println, getLinesFromFile };

const INDENT = ' ';

function println(input = '', indentLevel = 0) {
  let indent = '';

  for (let i = 0; i < indentLevel; ++i) {
    indent += INDENT;
  }

  input.split('\n').forEach(line => {
    process.stdout.write(`${indent}${line}\n`);
  });
}

function getLinesFromFile(filePath, lineNum, numSurroundingLines = 1) {
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((line, i) => `${i + 1}: ${line}`)
    .map((line, lineNum) => ({ line, lineNum: lineNum + 1 }))
    .filter(
      line =>
        line.lineNum < lineNum + numSurroundingLines + 1 &&
        line.lineNum > lineNum - numSurroundingLines - 1
    );
}

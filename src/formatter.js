const figures = require('figures');
const chalk = require('chalk');
const prettyMs = require('pretty-ms');
const jsondiffpatch = require('jsondiffpatch');
const fs = require('fs');

module.exports = {
  version,
  successAssert,
  failedAssert,
  formatComment,
  formatChild,
  formatExtra,
  formatComplete,
  startTest,
  endTest
};

const CHAR_TICK = figures.tick;
const CHAR_CROSS = figures.cross;
const INDENT = ' ';
const NUM_LINES = 2;

const OPERATORS = {
  equal: 'equal',
  deepEqual: 'deepEqual'
};

function startTest() {
  process.stdout.write(chalk.bold('# Tests\n\n'));
}

function version(version) {
  process.stdout.write(chalk.bold(`TAP version ${version}\n\n`));
}

function successAssert({ id, name, odd }) {
  const nameColorized = odd ? `${name} (${id})` : chalk.dim(`${name} (${id})`);
  process.stdout.write(`${chalk.green(CHAR_TICK)} ${nameColorized}\n`);
}

function failedAssert({ id, name, diag = {}, odd }) {
  // Message
  const nameColorized = odd ? `${name} (${id})` : chalk.dim(`${name} (${id})`);
  process.stdout.write(`${chalk.red(CHAR_CROSS)} ${nameColorized}\n`);

  println(chalk.bold('Overview'), 4);

  // Details
  if (diag.operator === OPERATORS.equal) {
    process.stdout.write(`    operator: ${diag.operator}\n`);
    process.stdout.write(
      `    expected: ${chalk.bgGreen.black(` ${diag.expected} `)}\n`
    );
    process.stdout.write(
      `    found: ${chalk.bgRed.black(` ${diag.actual} `)}\n`
    );
    printLocation(diag);
  } else if (diag.operator === OPERATORS.deepEqual) {
    const expected = diag.expected
      .replace(/([a-z]*):/g, '"$1":')
      .replace(/'/g, '"');
    const actual = diag.actual
      .replace(/([a-z]*):/g, '"$1":')
      .replace(/'/g, '"');

    process.stdout.write(`    operator: ${diag.operator}\n`);
    process.stdout.write(
      `    expected: ${chalk.bgGreen.black(` ${diag.expected} `)}\n`
    );
    process.stdout.write(
      `    found: ${chalk.bgRed.black(` ${diag.actual} `)}\n`
    );

    const delta = jsondiffpatch.diff(JSON.parse(actual), JSON.parse(expected));
    const output = jsondiffpatch.formatters.console.format(delta);

    println(chalk.bold('\nDifference'), 4);
    println(output, 4);
    printLocation(diag);
  }
  console.log();
}

function printLocation(diag) {
  println(chalk.bold('\nLocation'), 4);
  const fileAndLine = diag.at.match(/\((.*)\)/)[1];
  const file = fileAndLine.match(/[^:]*/)[0];
  const line = diag.at.match(/:(\d+):/)[1];

  println(`${chalk.dim(fileAndLine)}\n`, 4);
  const lines = readLines(file, parseInt(line));
  println(chalk.dim(lines), 4);
}

function readLines(filePath, lineNum) {
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((line, i) => `${i + 1}: ${line}`)
    .filter(
      (line, i) => i + 1 > lineNum - NUM_LINES && i + 1 < lineNum + NUM_LINES
    )
    .join('\n');
}

function endTest({ numTests, numPassed, numFailed, duration } = {}) {
  const numFailedColorized = numFailed > 0 ? chalk.red(numFailed) : numFailed;

  process.stdout.write(chalk.bold('\n# Summary\n\n'));
  process.stdout.write(`Total: ${numTests}\n`);
  process.stdout.write(`Passed: ${chalk.green(numPassed)}\n`);

  if (numFailed === 0) {
    process.stdout.write(chalk.bgGreen.black('\n All tests passed! \n'));
    process.stdout.write(`\nDuration: ${prettyMs(duration)}\n`);
  } else {
    process.stdout.write(`Failed: ${numFailedColorized}\n`);
    process.stdout.write(`\nDuration: ${prettyMs(duration)}\n`);
    process.stdout.write(
      chalk.bgRed.black(`\n ${numFailed} out of ${numTests} tests failed! \n`)
    );
  }
}

function println(input = '', indentLevel = 0) {
  let indent = '';

  for (let i = 0; i < indentLevel; ++i) {
    indent += INDENT;
  }

  input.split('\n').forEach(line => {
    process.stdout.write(`${indent}${line}\n`);
  });
}

function formatComment() {}
function formatChild() {}
function formatExtra() {}
function formatComplete() {}

// const startedAt = Date.now();

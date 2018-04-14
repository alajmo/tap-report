const figures = require('figures');
const chalk = require('chalk');
const prettyMs = require('pretty-ms');
const jsondiffpatch = require('jsondiffpatch');
const { println, getLinesFromFile } = require('./util.js');

module.exports = {
  printTapVersion,
  printSuccessfulAssert,
  printFailedAssert,
  printExtra,
  printStartTest,
  printEndTest
};

const CHAR_TICK = figures.tick;
const CHAR_CROSS = figures.cross;
const NUM_SURROUNDING_LINES = 1;

const OPERATORS = {
  equal: 'equal',
  deepEqual: 'deepEqual'
};

function printStartTest() {
  println(chalk.bold('# Tests\n'));
}

function printEndTest({ numTests, numPassed, numFailed, duration } = {}) {
  const numFailedColorized = numFailed > 0 ? chalk.red(numFailed) : numFailed;

  println(chalk.bold('\n# Summary\n'));
  println(`Total: ${numTests}`);
  println(`Passed: ${chalk.green(numPassed)}`);

  if (numFailed === 0) {
    println(chalk.bgGreen.black('\n All tests passed! \n'));
    println(`Duration: ${prettyMs(duration)}`);
  } else {
    println(`Failed: ${numFailedColorized}`);
    println(`Duration: ${prettyMs(duration)}`);
    println(
      chalk.bgRed.black(`\n ${numFailed} out of ${numTests} tests failed!`)
    );
  }
}

function printTapVersion(version) {
  println(chalk.bold(`TAP version ${version}\n`));
}

function printSuccessfulAssert({ id, name }) {
  const odd = parseInt(id) % 2;
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(`${chalk.green(CHAR_TICK)}  ${idParam} - ${nameParam}`);
}

function printFailedAssert({ id, name, diag = {} }) {
  const odd = parseInt(id) % 2;

  // Message
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);
  const operatorParam = diag.operator;
  const expectedParam = chalk.bgGreen.black(` ${diag.expected} `);
  const actualParam = chalk.bgRed.black(` ${diag.actual} `);

  println(`${chalk.red(CHAR_CROSS)}  ${idParam} - ${nameParam}\n`);

  println(chalk.bold('# Overview'), 4);

  // Details
  if (diag.operator === OPERATORS.equal) {
    println(`operator: ${operatorParam}`, 4);
    println(`expected: ${expectedParam}`, 4);
    println(`found: ${actualParam}`, 4);
    printFileErrorLines(diag);
  } else if (operatorParam === OPERATORS.deepEqual) {
    const expected = diag.expected
      .replace(/([a-z]*):/g, '"$1":')
      .replace(/'/g, '"');
    const actual = diag.actual
      .replace(/([a-z]*):/g, '"$1":')
      .replace(/'/g, '"');

    println(`operator: ${operatorParam}`, 4);
    println(`expected: ${chalk.bgGreen.black(` ${diag.expected} `)}`, 4);
    println(`found: ${chalk.bgRed.black(` ${diag.actual} `)}`, 4);

    const delta = jsondiffpatch.diff(JSON.parse(actual), JSON.parse(expected));
    const output = jsondiffpatch.formatters.console.format(delta);

    println(chalk.bold('\nDifference'), 4);
    println(output, 4);
    printFileErrorLines(diag);
  }
  println();
}

function printFileErrorLines(diag) {
  println(chalk.bold('\n# Location'), 4);
  const fileAndLine = diag.at.match(/\((.*)\)/)[1];
  const file = fileAndLine.match(/[^:]*/)[0];
  const lineNum = parseInt(diag.at.match(/:(\d+):/)[1]);

  println(`${chalk.dim(fileAndLine)}\n`, 4);
  const lines = getLinesFromFile(file, lineNum, NUM_SURROUNDING_LINES);

  lines.map(elem => {
    lineNum === elem.lineNum
      ? println(elem.line, 4)
      : println(chalk.dim(elem.line), 4);
  });
}

function printExtra(extra) {
  println(chalk.red(`extra: ${extra}`));
}

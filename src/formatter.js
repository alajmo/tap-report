const figures = require('figures');
const path = require('path');
const chalk = require('chalk');
const prettyMs = require('pretty-ms');
const jsondiffpatch = require('jsondiffpatch');
const { println, getLinesFromFile } = require('./util.js');

module.exports = {
  printTapVersion,
  printSuccessfulAssert,
  printSkippedAssert,
  printTodoAssert,
  printFailedAssert,
  printExtra,
  printStartTest,
  printEndTest
};

const CHAR_WARNING = figures.warning;
const CHAR_TICK = figures.tick;
const CHAR_CROSS = figures.cross;
const NUM_SURROUNDING_LINES = 1;

function printStartTest() {
  println(chalk.bold('# Tests\n'));
}

function printEndTest({
  duration,
  numFailed,
  numPassed,
  numSkipped,
  numTests,
  numTodo
} = {}) {
  const numFailedColorized = numFailed > 0 ? chalk.red(numFailed) : numFailed;

  println(chalk.bold('\n# Summary\n'));
  println(`Passed: ${chalk.green(numPassed)}`);

  if (numSkipped > 0) {
    println(`Skipped: ${chalk.yellow(numSkipped)}`);
  }

  if (numTodo > 0) {
    println(`Todo: ${chalk.yellow(numTodo)}`);
  }

  if (numFailed === 0) {
    println(`Total: ${numTests}\n`);
    println(`Duration: ${prettyMs(duration)}`);
    println(chalk.bgGreen.black('\n All tests passed! \n'));
  } else {
    println(`Failed: ${numFailedColorized}`);
    println(`Total: ${numTests}\n`);
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

function printSkippedAssert({ id, name }) {
  const odd = parseInt(id) % 2;
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const skipParam = odd ? '(skip)' : chalk.dim('(skip)');
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(
    `${chalk.yellow(CHAR_WARNING)}  ${idParam} - ${nameParam} ${skipParam}`
  );
}

function printTodoAssert({ id, name }) {
  const odd = parseInt(id) % 2;
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const todoParam = odd ? '(todo)' : chalk.dim('(todo)');
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(
    `${chalk.yellow(CHAR_WARNING)}  ${idParam} - ${nameParam} ${todoParam}`
  );
}

function printFailedAssert({ id, name, diag = {} }) {
  const odd = parseInt(id) % 2;

  // Message
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(`${chalk.red(CHAR_CROSS)}  ${idParam} - ${nameParam}`);

  // Details
  println(chalk.bold('\n# Error'), 4);
  printDifference(({ found, wanted } = diag));
  printFileErrorLines(diag.at);
  println();
}

function printDifference({ found, wanted }) {
  const foundParsed = parseValue(found);
  const wantedParsed = parseValue(wanted);

  const delta = jsondiffpatch.diff(foundParsed, wantedParsed);
  const output = jsondiffpatch.formatters.console.format(delta);
  println(output, 4);
}

function parseValue(value) {
  let valueParsed;
  if (['number', 'boolean'].includes(typeof value)) {
    eval('valueParsed=' + value);
  } else if (['object', 'string'].includes(typeof value)) {
    eval('valueParsed=' + JSON.stringify(value));
  }
  return valueParsed;
}

function printFileErrorLines(at) {
  println(chalk.bold('\n# File'), 4);

  const { file, line: lineNum, column } = at;

  println(`${chalk.dim(`${file}:${lineNum}:${column}`)}\n`, 4);

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

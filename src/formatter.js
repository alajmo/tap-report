const figures = require('figures');
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
  printStartTest,
  printBailout,
  printEndTest
};

const WARNING_FIGURE = figures.bullet;
const SUCCESS_FIGURE = figures.bullet;
const FAILURE_FIGURE = figures.bullet;
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
    println(chalk.green('\nAll tests passed! \n'));
  } else {
    println(`Failed: ${numFailedColorized}`);
    println(`Total: ${numTests}\n`);
    println(`Duration: ${prettyMs(duration)}`);
    println(chalk.red(`\n${numFailed} out of ${numTests} tests failed!`));
  }
}

function printTapVersion(version) {
  println(chalk.bold(`TAP version ${version}\n`));
}

function printSuccessfulAssert({ id, name, durationPerAssert, subTest }) {
  const odd = parseInt(id) % 2;
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(
    `${chalk.green(SUCCESS_FIGURE)}  ${idParam} - ${nameParam} (${prettyMs(
      durationPerAssert
    )})`,
    subTest ? 2 : 0
  );
}

function printSkippedAssert({ id, name, durationPerAssert, subTest }) {
  const odd = parseInt(id) % 2;
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const skipParam = odd ? '(skip)' : chalk.dim('(skip)');
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(
    `${chalk.yellow(
      WARNING_FIGURE
    )}  ${idParam} - ${nameParam} ${skipParam} (${prettyMs(
      durationPerAssert
    )})`,
    subTest ? 2 : 0
  );
}

function printTodoAssert({ id, name, durationPerAssert, subTest }) {
  const odd = parseInt(id) % 2;
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const todoParam = odd ? '(todo)' : chalk.dim('(todo)');
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(
    `${chalk.yellow(
      WARNING_FIGURE
    )}  ${idParam} - ${nameParam} ${todoParam} (${prettyMs(
      durationPerAssert
    )})`,
    subTest ? 2 : 0
  );
}

function printFailedAssert({
  id,
  name,
  durationPerAssert,
  diag = {},
  subTest
}) {
  const odd = parseInt(id) % 2;

  // Message
  const nameParam = odd ? `${name}` : chalk.dim(`${name}`);
  const idParam = odd ? `${id}` : chalk.dim(`${id}`);

  println(
    `${chalk.red(FAILURE_FIGURE)}  ${idParam} - ${nameParam} (${prettyMs(
      durationPerAssert
    )})`,
    subTest ? 2 : 0
  );

  if (Object.keys(diag).length === 0) {
    return;
  }

  // Details
  println(chalk.bold('\n# Error'), subTest ? 6 : 4);
  printDifference({ subTest, ...diag });
  printFileErrorLines({ at: diag.at, subTest });
  println();
}

function printBailout(reason) {
  println(chalk.red(`Bail out! ${reason}`));
}

function printDifference({ found, wanted, subTest }) {
  // console.log(subTest);
  const foundParsed = parseValue(found);
  const wantedParsed = parseValue(wanted);

  const delta = jsondiffpatch.diff(foundParsed, wantedParsed);
  const output = jsondiffpatch.formatters.console.format(delta);
  println(output, subTest ? 6 : 4);
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

function printFileErrorLines({ at, subTest }) {
  if (!at) {
    return;
  }
  println(chalk.bold('\n# File'), subTest ? 6 : 4);

  const { file, line: lineNum, column } = at;

  println(`${chalk.dim(`${file}:${lineNum}:${column}`)}\n`, subTest ? 6 : 4);

  const lines = getLinesFromFile(file, lineNum, NUM_SURROUNDING_LINES);
  lines.map(elem => {
    lineNum === elem.lineNum
      ? println(elem.line, subTest ? 6 : 4)
      : println(chalk.dim(elem.line), subTest ? 6 : 4);
  });
}

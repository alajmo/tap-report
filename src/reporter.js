const Parser = require('tap-parser');
const format = require('./formatter.js');

const stats = {
  numTests: 0,
  numSkipped: 0,
  numTodo: 0,
  numPassed: 0,
  numFailed: 0,
  duration: 0,
  durationPerAssert: 0
};

module.exports = reporter;

function reporter() {
  const parser = new Parser({ strict: true });

  parser.on('version', handleVersion);
  parser.on('assert', handleAssert);
  parser.on('complete', () => handleComplete(parser));

  return parser;
}

function startTest(version) {
  stats.duration = stats.durationPerAssert = Date.now();

  format.printTapVersion(version);
  format.printStartTest();
}

function handleVersion(version) {
  startTest(version);
}

function handleAssert(assert) {
  stats.durationPerAssert = Date.now() - stats.durationPerAssert;

  if (assert.skip) {
    stats.numSkipped += 1;
    format.printSkippedAssert({
      ...assert,
      durationPerAssert: stats.durationPerAssert
    });
  } else if (assert.todo) {
    stats.numTodo += 1;
    format.printTodoAssert({
      ...assert,
      durationPerAssert: stats.durationPerAssert
    });
  } else if (assert.ok) {
    stats.numPassed += 1;
    format.printSuccessfulAssert({
      ...assert,
      durationPerAssert: stats.durationPerAssert
    });
  } else {
    stats.numFailed += 1;
    format.printFailedAssert({
      ...assert,
      durationPerAssert: stats.durationPerAssert
    });
  }

  stats.durationPerAssert = Date.now();
  stats.numTests += 1;
}

function handleComplete(parser) {
  stats.duration = Date.now() - stats.duration;

  format.printEndTest(
    ({ duration, numFailed, numPassed, numSkipped, numTests } = stats)
  );

  parser.end();
}

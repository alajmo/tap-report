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
  parser.on('bailout', handleBailout);
  parser.on('complete', () => handleComplete(parser));
  parser.on('child', childParser => {
    childParser.on('assert', handleAssert);
  });

  process.on('exit', () => handleExit(parser));

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
    stats.numTests += 1;
    format.printSkippedAssert({
      ...assert,
      id: stats.numTests,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  } else if (assert.todo) {
    stats.numTodo += 1;
    stats.numTests += 1;
    format.printTodoAssert({
      ...assert,
      id: stats.numTests,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  } else if (assert.ok) {
    stats.numPassed += 1;
    stats.numTests += 1;
    format.printSuccessfulAssert({
      ...assert,
      id: stats.numTests,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  } else {
    if (assert.diag) {
      stats.numFailed += 1;
      stats.numTests += 1;
      format.printFailedAssert({
        ...assert,
        id: stats.numTests,
        durationPerAssert: stats.durationPerAssert
      });
    }
    stats.durationPerAssert = Date.now();
  }
}

function handleBailout() {
  format.printBailout();
}

function handleComplete(parser) {
  stats.duration = Date.now() - stats.duration;

  format.printEndTest(
    ({ duration, numFailed, numPassed, numSkipped, numTests } = stats)
  );
}

function handleExit(parser) {
  parser.end();
}

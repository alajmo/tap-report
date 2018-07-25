const Parser = require('tap-parser');
const format = require('./formatter.js');

let currentId = 0;
const stats = {
  numTests: 0,
  numSkipped: 0,
  numTodo: 0,
  numPassed: 0,
  numFailed: 0,
  duration: 0,
  durationPerAssert: 0
};
let childAsserts = [];

module.exports = reporter;

function reporter() {
  const parser = new Parser({ strict: true });

  parser.on('version', handleVersion);
  parser.on('assert', handleAssert);
  parser.on('bailout', reason => handleBailout(reason));
  parser.on('complete', () => handleComplete(parser));
  parser.on('child', childParser =>
    childParser.on('assert', handleChildAssert)
  );

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

function handleChildAssert(assert) {
  childAsserts.push(assert);
}

function handleAssert(assert) {
  if (childAsserts.length > 0) {
    processAssert({ assert, countTest: false, subTest: false });
    childAsserts.forEach(assert => processAssert({ assert, subTest: true }));
    childAsserts = [];
  } else {
    processAssert({ assert });
  }
}

function processAssert({ assert, countTest = true, subTest = false }) {
  stats.durationPerAssert = Date.now() - stats.durationPerAssert;

  if (assert.skip) {
    if (countTest) {
      stats.numSkipped += 1;
      stats.numTests += 1;
    }
    format.printSkippedAssert({
      ...assert,
      id: currentId,
      subTest,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  } else if (assert.todo) {
    if (countTest) {
      stats.numTodo += 1;
      stats.numTests += 1;
    }
    format.printTodoAssert({
      ...assert,
      id: currentId,
      subTest,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  } else if (assert.ok) {
    if (countTest) {
      stats.numPassed += 1;
      stats.numTests += 1;
    }
    format.printSuccessfulAssert({
      ...assert,
      id: currentId,
      subTest,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  } else {
    if (countTest) {
      stats.numFailed += 1;
      stats.numTests += 1;
    }
    format.printFailedAssert({
      ...assert,
      id: currentId,
      subTest,
      durationPerAssert: stats.durationPerAssert
    });
    stats.durationPerAssert = Date.now();
  }

  currentId += 1;
}

function handleBailout(reason) {
  format.printBailout(reason);
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

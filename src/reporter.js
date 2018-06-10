const Parser = require('tap-parser');
const { Duplex } = require('stream');
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
  const duplex = getDuplex(parser, () => {});

  duplex.on('finish', () => parser.end());

  parser.on('version', handleVersion);
  parser.on('assert', handleAssert);
  parser.on('complete', handleComplete);

  return duplex;
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
      duration: stats.duration,
      durationPerAssert: stats.durationPerAssert
    });
  } else if (assert.todo) {
    stats.numTodo += 1;
    format.printTodoAssert({
      ...assert,
      duration: stats.duration,
      durationPerAssert: stats.durationPerAssert
    });
  } else if (assert.ok) {
    stats.numPassed += 1;
    format.printSuccessfulAssert({
      ...assert,
      duration: stats.duration,
      durationPerAssert: stats.durationPerAssert
    });
  } else {
    stats.numFailed += 1;
    format.printFailedAssert({
      ...assert,
      duration: stats.duration,
      durationPerAssert: stats.durationPerAssert
    });
  }

  stats.durationPerAssert = Date.now();
  stats.numTests += 1;
}

function handleComplete() {
  endTest();
}

function endTest() {
  stats.duration = Date.now() - stats.duration;

  format.printEndTest(
    ({ duration, numFailed, numPassed, numSkipped, numTests } = stats)
  );
}

function getDuplex(writer, reader) {
  return Duplex({
    read() {
      reader();
    },
    write(chunk, encoding, cb) {
      writer.write(chunk);
      cb();
    }
  });
}

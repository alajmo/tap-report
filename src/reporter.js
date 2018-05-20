const Parser = require('tap-parser');
const { Duplex } = require('stream');
const format = require('./formatter.js');

const stats = {
  numTests: 0,
  numSkipped: 0,
  numTodo: 0,
  numPassed: 0,
  numFailed: 0,
  duration: 0
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
  stats.duration = Date.now();
  format.printTapVersion(version);
  format.printStartTest();
}

function handleVersion(version) {
  startTest(version);
}

function handleAssert(assert) {
  if (assert.skip) {
    stats.numSkipped += 1;
    format.printSkippedAssert({ ...assert, duration: stats.duration });
  } else if (assert.todo) {
    stats.numTodo += 1;
    format.printTodoAssert({ ...assert, duration: stats.duration });
  } else if (assert.ok) {
    stats.numPassed += 1;
    format.printSuccessfulAssert({ ...assert, duration: stats.duration });
  } else {
    stats.numFailed += 1;
    format.printFailedAssert({ ...assert, duration: stats.duration });
  }

  stats.numTests += 1;
}

function handleComplete(result) {
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

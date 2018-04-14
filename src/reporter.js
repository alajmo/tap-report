const Parser = require('tap-parser');
const { Duplex } = require('stream');
const format = require('./formatter.js');

const stats = {
  numTests: 0,
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
  parser.on('extra', handleExtra); // Anything not covered by tap-parser

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
  if (assert.ok) {
    stats.numPassed += 1;
    format.printSuccessfulAssert({ ...assert, duration: stats.duration });
  } else {
    stats.numFailed += 1;
    format.printFailedAssert({ ...assert, duration: stats.duration });
  }

  stats.numTests += 1;
}

function handleExtra(extra) {
  format.printExtra();
}

function handleComplete() {
  endTest();
}

function endTest() {
  stats.duration = Date.now() - stats.duration;

  format.printEndTest({
    numTests: stats.numTests,
    numPassed: stats.numPassed,
    numFailed: stats.numFailed,
    duration: stats.duration
  });
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

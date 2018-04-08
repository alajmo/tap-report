const Parser = require('tap-parser');
const chalk = require('chalk');
const { Duplex } = require('stream');
const format = require('./formatter.js');

let odd = true;
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
  parser.on('comment', handleComment);
  parser.on('complete', handleComplete);
  parser.on('bailout', handleBailout);
  parser.on('extra', handleExtra); // Anything not covered by tap-parser

  return duplex;
}

function startTest(version) {
  stats.duration = Date.now();
  format.version(version);
  format.startTest();
}

function handleVersion(version) {
  startTest(version);
}

function handleBailout(reason) {
  console.log('bailout');
  console.log(reason);
}

function handleAssert(assert) {
  if (assert.ok) {
    stats.numPassed += 1;
    format.successAssert({ ...assert, duration: stats.duration, odd });
  } else {
    stats.numFailed += 1;
    format.failedAssert({ ...assert, duration: stats.duration, odd });
  }

  stats.numTests += 1;
  odd = !odd;
}

function handleComment(comment) {
  // console.log(chalk.yellow(`comment: ${comment}`));
}

function handleExtra(extra) {
  console.log(chalk.red(`extra: ${extra}`));
}

function handleComplete() {
  endTest();
}

function endTest() {
  stats.duration = Date.now() - stats.duration;

  format.endTest({
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

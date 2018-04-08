const Parser = require('tap-parser');
const chalk = require('chalk');
const { Duplex } = require('stream');
const format = require('./formatter.js');

module.exports = reporter;

function reporter() {
  const parser = new Parser({
    strict: true,
    preserveWhitespace: true,
    passes: true
  });
  const duplex = getDuplex(parser, () => {});

  duplex.on('finish', () => parser.end());

  parser.on('result', handlePlan);
  parser.on('diag', handlePlan);
  parser.on('line', handleLine);
  parser.on('comment', handleComment);
  parser.on('plan', handlePlan);
  parser.on('assert', handleAssert);
  parser.on('complete', handleComplete);
  parser.on('child', handleChild);
  parser.on('bailout', handleBailout);
  parser.on('extra', handleExtra); // Anything not covered by tap-parser

  return duplex;
}

function handleLine(line) {
  console.log(line);
}

function handlePlan(plan) {
  console.log('plan');
  console.log(plan);
}

function handleBailout(reason) {
  console.log('bailout');
  console.log(reason);
}

function handleAssert(assert) {
  console.log(chalk.bold.blue('assert'));
  console.log(assert);
  // assert.ok ? format.successAssert(assert) : format.failedAssert(assert);
}

function handleComment(comment) {
  // console.log(`comment: ${comment}`);
}

function handleChild(child) {
  console.log(chalk.bold.blue('child: \n'));
  console.log(chalk.green(`child.name ${child.name}`));
  console.log(chalk.green(`child.level ${child.level}`));
  console.log(child.parent);
}

function handleExtra(extra) {
  // console.log(`extra: ${extra}`);
}

function handleComplete() {
  console.log('complete');
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

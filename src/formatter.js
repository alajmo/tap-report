const figures = require('figures');
const chalk = require('chalk');

module.exports = {
  successAssert,
  failedAssert,
  formatComment,
  formatChild,
  formatExtra,
  formatComplete
};

const CHAR_TICK = figures.tick;
const CHAR_CROSS = figures.cross;

function successAssert(assert) {
  console.log(`assert: ${JSON.stringify(assert, null, 4)}`);
}

function failedAssert(assert) {
  console.log(`assert: ${JSON.stringify(assert, null, 4)}`);
}

function formatComment() {}
function formatChild() {}
function formatExtra() {}
function formatComplete() {}

// const startedAt = Date.now();

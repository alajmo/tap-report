const reporter = require('./reporter.js');

module.exports = handleTapStream;

function handleTapStream() {
  process.stdin.pipe(reporter()).pipe(process.stdout);

  process.on('exit', status => {
    console.log(`Exit with status: ${status}`);
  });
}

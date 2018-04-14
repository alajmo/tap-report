const fs = require('fs');

module.exports = { println, getLinesFromFile };

const INDENT = ' ';

function println(input = '', indentLevel = 0) {
  let indent = '';

  for (let i = 0; i < indentLevel; ++i) {
    indent += INDENT;
  }

  input.split('\n').forEach(line => {
    process.stdout.write(`${indent}${line}\n`);
  });
}

function getLinesFromFile(filePath, lineNum, numSurroundingLines = 1) {
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((line, i) => `${i + 1}: ${line}`)
    .map((line, lineNum) => ({ line, lineNum: lineNum + 1 }))
    .filter(
      line =>
        line.lineNum < lineNum + numSurroundingLines + 1 &&
        line.lineNum > lineNum - numSurroundingLines - 1
    );
}

const handleAssertFailure = assert => {
  const name = assert.name;

  const writeDiff = ({ value, added, removed }) => {
    let style = chalk.white;

    if (added) style = chalk.green.inverse;
    if (removed) style = chalk.red.inverse;

    // only highlight values and not spaces before
    return value.replace(/(^\s*)(.*)/g, (m, one, two) => one + style(two));
  };

  let { at, actual, expected } = assert.diag;

  let expected_type = toString(expected);

  if (expected_type !== 'array') {
    try {
      // the assert event only returns strings which is broken so this
      // handles converting strings into objects
      if (expected.indexOf('{') > -1) {
        actual = JSON.stringify(JSON.parse(JSONize(actual)), null, 2);
        expected = JSON.stringify(JSON.parse(JSONize(expected)), null, 2);
      }
    } catch (e) {
      try {
        actual = JSON.stringify(eval(`(${actual})`), null, 2);
        expected = JSON.stringify(eval(`(${expected})`), null, 2);
      } catch (e) {
        // do nothing because it wasn't a valid json object
      }
    }

    expected_type = toString(expected);
  }

  println(
    `${chalk.red(FIG_CROSS)}  ${chalk.red(name)} at ${chalk.magenta(at)}`,
    2
  );

  if (expected_type === 'object') {
    const delta = jsondiffpatch.diff(
      actual[failed_test_number],
      expected[failed_test_number]
    );
    const output = jsondiffpatch.formatters.console.format(delta);
    println(output, 4);
  } else if (expected_type === 'array') {
    const compared = diffJson(actual, expected)
      .map(writeDiff)
      .join('');

    println(compared, 4);
  } else if (expected === 'undefined' && actual === 'undefined') {
  } else if (expected_type === 'string') {
    const compared = diffWords(actual, expected)
      .map(writeDiff)
      .join('');

    println(compared, 4);
  } else {
    println(chalk.red.inverse(actual) + chalk.green.inverse(expected), 4);
  }
};

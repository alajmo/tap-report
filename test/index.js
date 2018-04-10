require('colors');
const child = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const test = require('tape');
const del = require('del');
const jsDiff = require('diff');

const TEST_DIR = path.join(__dirname, 'tests');
const TAP_REPORT_BIN = path.resolve(__dirname, '../bin/tap-report');
const TAP_OUTPUT_DIR = path.join(__dirname, 'data', 'tap-output');
const TAP_REPORT_OUTPUT_DIR = path.join(__dirname, 'data', 'tap-report-output');
const TEST_PATHS = [
  'tape-output-1.js',
  'tape-output-2.js',
  'tape-output-3.js',
  'tap-output-1.js',
  'tap-output-2.js',
  'tap-output-3.js'
].map(testPath => path.join(TEST_DIR, testPath));

main();

function main() {
  const command = process.argv[2];
  switch (command) {
    case 'run-tests':
      runTests(TAP_OUTPUT_DIR, TAP_REPORT_OUTPUT_DIR, TAP_REPORT_BIN);
      break;
    case 'generate-test-data':
      // tap data
      generateData({
        testPaths: TEST_PATHS,
        outputDir: TAP_REPORT_OUTPUT_DIR,
        command: testPath => `node ${testPath} | ${TAP_REPORT_BIN}`
      });

      // tap-report data
      generateData({
        testPaths: TEST_PATHS,
        outputDir: TAP_OUTPUT_DIR,
        command: testPath => `node ${testPath}`
      });
      break;
    default:
      console.log('No option specified');
  }
}

function generateData({ testPaths, outputDir, command }) {
  del.sync([path.join(outputDir, 'tap-output-*')]);

  testPaths.forEach(testPath => {
    child.exec(command(testPath), (err, stdout) => {
      const dataFile = path.join(outputDir, path.parse(testPath).name);
      fs.writeFileSync(dataFile, stdout);
    });
  });
}

function runTests(tapDataDir, tapReportDataDir, bin) {
  test('regression tests', t => {
    fs.readdirSync(tapDataDir).map(filePath => {
      // Run tap-report on tap data
      const actualFilePath = path.join(tapDataDir, filePath);
      const actualFileContent = child.execSync(
        `cat ${actualFilePath} | ${bin}`,
        {
          encoding: 'utf-8'
        }
      );

      // Read previous tap-report datRead previous tap-report data
      const expectedFileContent = fs.readFileSync(
        path.join(tapReportDataDir, path.parse(filePath).name),
        'utf-8'
      );

      // Find differences
      const diff = jsDiff.diffTrimmedLines(
        actualFileContent,
        expectedFileContent
      );

      let foundDifference = false;
      let output = '';
      diff.forEach(part => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';

        // Ignore Duration line since it varies from run to run
        if (
          (part.added || part.removed) &&
          !part.value.includes('Duration: ')
        ) {
          foundDifference = true;
        }

        output += part.value[color];
      });

      if (foundDifference) {
        process.stdout.write(output);
      }

      t.equal(
        foundDifference,
        false,
        `file ${chalk.bold(filePath)} passed regression test`
      );
    });

    t.end();
  });
}

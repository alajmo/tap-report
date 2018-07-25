require('colors');
const child = require('child_process');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const tap = require('tap');
const del = require('del');
const jsDiff = require('diff');

const TEST_DIR = path.join(__dirname, 'tests');
const TAP_REPORT_BIN = path.resolve(__dirname, '../bin/tap-report');
const TAP_OUTPUT_DIR = path.join(__dirname, 'snapshots', 'tap-output');
const TAP_REPORT_OUTPUT_DIR = path.join(
  __dirname,
  'snapshots',
  'tap-report-output'
);
const TEST_PATHS = [
  { file: 'tap-output-1.js' },
  { file: 'tap-output-2.js' },
  { file: 'tap-output-3.js' },
  { file: 'tap-output-4.js' },
  { file: 'tap-output-5.js', options: '--bail' }
].map(({ file, options = '' }) => ({
  file: path.join(TEST_DIR, file),
  options
}));

main();

function main() {
  const command = process.argv[2];
  switch (command) {
    case 'run-tests':
      runTests(TAP_OUTPUT_DIR, TAP_REPORT_OUTPUT_DIR, TAP_REPORT_BIN);
      break;
    case 'generate-test-data':
      // tap-report data
      generateData({
        testPaths: TEST_PATHS,
        outputDir: TAP_REPORT_OUTPUT_DIR,
        command: ({ file, options }) => `tap ${file} ${options} | ${TAP_REPORT_BIN}`
      });

      // tap data
      generateData({
        testPaths: TEST_PATHS,
        outputDir: TAP_OUTPUT_DIR,
        command: ({ file, options }) => `tap ${file} ${options }`
      });
      break;
    default:
      console.log('No option specified');
  }
}

function generateData({ testPaths, outputDir, command }) {
  del.sync([path.join(outputDir, 'tap-output-*')]);

  testPaths.forEach(({ file, options }) => {
    child.exec(command({ file, options }), (err, stdout) => {
      const dataFile = path.join(outputDir, path.parse(file, options).name);
      fs.writeFileSync(dataFile, stdout);
    });
  });
}

function runTests(tapDataDir, tapReportDataDir, bin) {
  fs.readdirSync(tapDataDir).map(filePath => {
    // Run tap-report on tap data
    const actualFilePath = path.join(tapDataDir, filePath);
    const actualFileContent = child.execSync(`cat ${actualFilePath} | ${bin}`, {
      encoding: 'utf-8'
    });

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
        !part.value.includes('Duration: ') &&
        !part.value.includes('s)')
      ) {
        foundDifference = true;
      }

      output += part.value[color];
    });

    if (foundDifference) {
      process.stdout.write(output);
    }

    tap.equal(
      foundDifference,
      false,
      `file ${chalk.bold(filePath)} passed regression test`
    );
  });
}

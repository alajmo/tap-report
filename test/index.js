const child = require('child_process');
const path = require('path');
const fs = require('fs');
// const tap = require('tap');
const test = require('tape');

// const mockFolderPath = path.resolve(__dirname, 'mock');
// const files = fs.readdirSync(mockFolderPath).map(filePath => ({
//   path: path.resolve(__dirname, 'mock', filePath),
//   content: fs.readFileSync(path.resolve(__dirname, 'mock', filePath), 'utf-8')
// }));

// const tappatbinPath = path.resolve(__dirname, '../bin/tap-view');
// files.forEach(file => {
//   child.execSync(`echo "${file.content}" | ${tappatbinPath}`, {
//     stdio: [0, 1, 2]
//   });
// });

// const fileContent = fs.readFileSync(
//   path.resolve(__dirname, 'mock', 'tap-fail-2.output'),
//   'utf-8'
// );
// child.execSync(`echo "${fileContent}" | ${tappatbinPath}`, {
//   stdio: [0, 1, 2]
// });

// tap.equal(1 === 0, true, 'optional message 3');

// console.log('\n=== tap === \n');
// tap.test('Test message 1', t => {
//   t.equal(1 === 1, true, 'optional message 0');
//   t.equal(1 === 2, true, 'optional message 1');
//   t.end();
// });
// tap.test('Test message 2', t => {
//   t.equal(0 === 1, true, 'optional message 2');
//   t.end();
// });
test('Test message 3', t => {
  t.equal(0 === 0, true, '0 === 0');
  t.equal('hej', 'san', '0 === 1');
  t.deepEqual(
    { han: 1, hej: 'san', lala: 'land', sup: [1, 2, 3] },
    { han: 1, hej: 'sa', lala: 'land', sup: [2, 5] },
    'deepEqual'
  );

  t.end();
});
test('Test message 4', t => {
  t.equal(1 === 1, true, 'optional message 5');
  t.equal(2 === 2, true, 'optional message 6');
  t.equal(3 === 3, true, 'optional message 7');
  t.end();
});

test('Test message 1', t => {
  t.equal(1 === 1, true, 'optional message 0');
  t.equal(1 === 2, true, 'optional message 1');
  t.end();
});
test('Test message 2', t => {
  t.equal(0 === 1, true, 'optional message 2');
  t.end();
});
test('Test message 3', t => {
  t.equal(0 === 1, true, 'optional message 3');
  t.equal(1 === 2, true, 'optional message 4');
  t.end();
});
test('Test message 4', t => {
  t.equal(1 === 1, true, 'optional message 5');
  t.equal(2 === 2, true, 'optional message 6');
  t.equal(3 === 3, true, 'optional message 7');
  t.end();
});

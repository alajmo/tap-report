const test = require('tape');

test('Test message 1', t => {
  t.equal(1 === 1, true, 'optional message 0');
  t.equal(1 === 2, true, 'optional message 1');
  t.equal(1 === 1, true, 'optional message 1');
  t.deepEqual({ hej: 'san' }, { hej: 'an' }, 'optional message 1');
  t.end();
});

// test('Test message 2', t => {
//   t.equal(0 === 1, true, 'optional message 2');
//   t.end();
// });

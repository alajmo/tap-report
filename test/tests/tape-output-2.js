// All fail with tape
const test = require('tape');

test('Test message 1', t => {
  t.equal(1 !== 1, true, 'optional message 0');
  t.equal(2, 3, 'optional message 1');
  t.end();
});

test('Test message 2', t => {
  t.equal(1 === 2, true, 'optional message 2');
  t.end();
});

test('Test message 3', t => {
  t.deepEqual({ hello: 'y friend' }, { hello: 'my friend' }, 'deep equal 2');
  t.end();
});

test('Test message 3', t => {
  t.deepEqual(
    { ello: { world: 'my friend' } },
    { hello: { world: 'my friend' } },
    'deep equal 2'
  );
  t.end();
});

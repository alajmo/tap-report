// Mixed pass and fail with tape
const test = require('tape');

test('Test message 1', t => {
  t.equal(1 === 1, true, 'optional message 0');
  t.equal('a', 2, 'optional message 1');
  t.end();
});

test('Test message 2', t => {
  t.equal(1 === 1, true, 'optional message 2');
  t.end();
});

test('Test message 3', t => {
  t.deepEqual({ hello: 'my friend' }, { hello: 'my friend' }, 'deep equal 2');
  t.end();
});

test('Test message 3', t => {
  t.deepEqual(
    { hello: { world: 'my friend' } },
    { ello: { world: 'my friend' } },
    'deep equal 2'
  );
  t.end();
});

// All pass with tape
const test = require('tape');

test('Test message 0', t => {
  setTimeout(() => {
    t.equal(1 === 1, true, 'optional message 2');
  }, 1000);

  t.end();
});

test('Test message 1', t => {
  t.equal(1 === 1, true, 'optional message 0');
  t.equal(2, 2, 'optional message 1');
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

test('Test message 4', t => {
  t.deepEqual(
    { hello: { world: 'my friend' } },
    { hello: { world: 'my friend' } },
    'deep equal 2'
  );
  t.end();
});

// Mixed pass and fail with tap
const tap = require('tap');

tap.equal(1 === 1, true, 'optional message 0');
tap.equal('a', 2, 'optional message 1');

tap.equal(1 === 1, true, 'optional message 2');

tap.deepEqual({ hello: 'my friend' }, { hello: 'my friend' }, 'deep equal 2');

tap.deepEqual(
  { hello: { world: 'my friend' } },
  { ello: { world: 'my friend' } },
  'deep equal 2'
);

tap.end();

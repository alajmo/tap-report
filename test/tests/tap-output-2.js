// All fail with tap
const tap = require('tap');

tap.equal(1 !== 1, true, 'optional message 0');
tap.equal(2, 3, 'optional message 1');

tap.equal(1 === 2, true, 'optional message 2');

tap.deepEqual({ hello: 'y friend' }, { hello: 'my friend' }, 'deep equal 2');

tap.deepEqual(
  { ello: { world: 'my friend' } },
  { hello: { world: 'my friend' } },
  'deep equal 2'
);

tap.end();

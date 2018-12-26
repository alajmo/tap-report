// All pass with tap
//
const tap = require('tap');

setTimeout(() => {
  tap.equal(1 === 1, true, 'optional message 2');
}, 1000);

tap.equal(1 === 1, true, 'optional message 0');
tap.equal(2, 2, 'optional message 1');

tap.equal(1 === 1, true, 'optional message 2');

tap.deepEqual({ hello: 'my friend' }, { hello: 'my friend' }, 'deep equal 2');

console.log('Some extra message');

tap.deepEqual(
  { hello: { world: 'my friend' } },
  { hello: { world: 'my friend' } },
  'deep equal 2'
);

tap.end();

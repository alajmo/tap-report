// Mixed pass and fail with tap
const tap = require('tap');

tap.equal(1 === 1, true, 'foo');
tap.equal('foo', 'foo', 'bar');

tap.test('subtests', t => {
  t.equal(1, 2, 'lala land');
  t.equal(2, 2, 'olololo');
  t.end();
});

tap.equal('foo', 'foo', 'bar');

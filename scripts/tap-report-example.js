const tap = require('tap');

tap.equal('foo', 'foo', 'custom message');

tap.test('subtest example', t => {
  t.deepEqual({ foo: 'bar' }, { foo: 'ba' });
  t.end();
});

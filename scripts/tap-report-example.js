const tap = require('tap');

tap.equal('foo', 'foo', 'custom message');
tap.test('subtest exampke', t => {
  t.deepEqual({ foo: 'bar' }, { foo: 'ba' });
  t.end();
});

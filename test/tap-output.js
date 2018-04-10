const tap = require('tap');

tap('Test message 1', t => {
  t.equal(1 === 1, true, 'optional message 0');
  t.equal(1 === 2, true, 'optional message 1');
  t.end();
});

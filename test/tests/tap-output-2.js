const test = require('tape');

test('Test message 3', t => {
  t.equal(0 === 0, true, '0 === 0');
  t.equal('hej', 'san', '0 === 1');
  t.deepEqual(
    { han: 1, hej: 'san', lala: 'land', sup: [1, 2, 3] },
    { han: 1, hej: 'sa', lala: 'land', sup: [2, 5] },
    'deepEqual'
  );

  t.end();
});

test('Test message 4', t => {
  t.equal(1 === 1, true, 'optional message 5');
  t.equal(2 === 2, true, 'optional message 6');
  t.equal(3 === 3, true, 'optional message 7');
  t.end();
});

test('Test message 1', t => {
  t.equal(1 === 1, true, 'optional message 0');
  t.equal(1 === 2, true, 'optional message 1');
  t.end();
});

test('Test message 2', t => {
  t.equal(0 === 1, true, 'optional message 2');
  t.end();
});

test('Test message 3', t => {
  t.equal(0 === 1, true, 'optional message 3');
  t.equal(1 === 2, true, 'optional message 4');
  t.end();
});

test('Test message 4', t => {
  t.equal(1 === 1, true, 'optional message 5');
  t.equal(2 === 2, true, 'optional message 6');
  t.equal(3 === 3, true, 'optional message 7');
  t.end();
});


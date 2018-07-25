const tap = require('tap');
// const tapReport = require('../src/reporter.js');
// tap.pipe(tapReport());

const foo = {
  glossary: {
    title: 'example glossary'
  }
};

const bar = {
  glossary: {
    title: 'example glossarys',
    lala: {
      boom: 'hello'
    }
  }
};

// Skipped
// tap.equal(1 === 1, true, 'skip message', { skip: true });

// Todo
// tap.equal(1 === 1, true, 'todo message', { todo: true });

// Passing
// tap.equal(2 === 1, true, 'foo');
tap.equal('foo', 'foo', 'bar');

tap.test('get thing', t => {
  t.equal(2, 2, 'get thing sub test 1');
  t.equal(2, 2, 'get thing sub test 2');
  t.end();
});

tap.equal('foo', 'foo', 'bar');

// Failing
// tap.equal(1 === 2, true, 'optional message 1');
// tap.equal(1, 2, 'failing test');
// tap.equal('1', 1, 'failing test');
// tap.equal('hello my friend', 'hello mi friend', 'failing string equal');
// tap.equal(1, false, 'failing test');
// tap.equal(true, false, 'optional message 1');
// tap.deepEqual(foo, bar, 'failing deep equal');
// tap.deepEqual({ a: 1 }, { a: 2 }, 'failing deep equal');

// Promises
// setTimeout(() => {
//   tap.equal(true, false, 'long polling');
// }, 10000);

// setTimeout(() => {
//   tap.equal(true, true, 'optional message 1');
// }, 10000);

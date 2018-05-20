const tap = require('tap');

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
tap.equal(1 === 1, true, 'skip message', { skip: true });

// Todo
tap.equal(1 === 1, true, 'todo message', { todo: true });

// Passing
tap.equal(1 === 1, true, 'optional message 0');
tap.equal('foo', 'foo', 'optional message 0');

// Failing
tap.equal(1 === 2, true, 'optional message 1');
tap.equal(1, 2, 'failing test');
tap.equal('1', 1, 'failing test');
tap.equal('hello my friend', 'hello mi friend', 'failing string equal');
tap.equal(1, false, 'failing test');
tap.equal(true, false, 'optional message 1');
tap.deepEqual(foo, bar, 'failing deep equal');
tap.deepEqual({ a: 1 }, { a: 2 }, 'failing deep equal');

// Promises
// setTimeout(() => {
//   tap.equal(true, false, 'optional message 1');
// }, 10000);

// setTimeout(() => {
//   tap.equal(true, true, 'optional message 1');
// }, 10000);

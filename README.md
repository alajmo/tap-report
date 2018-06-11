# tap-report

A tap (test anything protocol) consumer that provides user friendly and informative tap output.

![example output of tap-report](media/output.gif)

### Features

* User friendly assertion messages
* Line reporting
* Colors, colors, colors
* Helpful difference

Built on [tap-parser](https://github.com/tapjs/tap-parser) and tested to work with [node-tap](https://github.com/tapjs/node-tap).

## Motivation

I needed a flexible tap reporter that was capable of producing a summary as well as an extensive error report.

## Usage

```
Usage: tap-report [options]

A tap (test anything protocol) consumer that provides user friendly and informative tap output

Options:

  -V, --version  output the version number
  -h, --help     output usage information

Examples:

  Build project
  $ <tap output> | tap-report
```

## API

Can also be consumed programmatically (via streams):

```js
const tap = require('tap');
const tapReport = require('tap-report');
tap.pipe(tapReport());
```

## Inspiration

* [ava](https://github.com/avajs/ava)
* [faucet](https://github.com/substack/faucet)
* [tap-summary](https://github.com/zoubin/tap-summary)
* [tap-diff](https://github.com/axross/tap-diff)

## Contribution

Follows [guidelines](docs/CONTRIBUTING.md) and [conventional commits](https://conventionalcommits.org/).

```sh
# Install dependencies
$ npm install

# Start auto-refresh development scripts
# $ npm run dev
# $ npm run dev-example
# $ npm run dev-tap

# In case output is modified, generate new snapshots
# $ npm run generate-test-data

# In case output is modified, create new example gif (requires docker and imagemagick)
# $ npm run generate-media

# Run tests
$ npm test
```

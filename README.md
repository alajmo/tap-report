# tap-report

A tap (test anything protocol) consumer that provides user friendly and informative tap output.

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

## Inspiration

* [ava](https://github.com/avajs/ava)
* [faucet](https://github.com/substack/faucet)
* [tap-summary](https://github.com/zoubin/tap-summary)
* [tap-diff](https://github.com/axross/tap-diff)

## Contribution

Follows [Conventional Commits](https://conventionalcommits.org/).

```sh
# Install dependencies
$ npm install

# Starts an auto-refresh dev script
# $ npm run dev

# If you change the terminal output generate new test cases
# $ npm generate-test-data

$ npm test
```

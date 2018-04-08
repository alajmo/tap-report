# TAP

## Format

```txt
1..48
ok 1 Description # Directive
# Diagnostic
....
ok 47 Description
ok 48 Description
```

## Examples

```txt
1..4
ok 1 - Input file opened
not ok 2 - First line of the input valid.
    More output from test 2. There can be
    arbitrary number of lines for any output
    so long as there is at least some kind
    of whitespace at beginning of line.
ok 3 - Read the rest of the file
#TAP meta information
not ok 4 - Summarized correctly # TODO Not written yet
```

## Desired Format

```txt
<TAP Version>

# Tests
✔ <id>, <description>, <time it took to run test>
✖ <id>, <description>, <time it took to run test>
    <Location of failed test>

# Summary
Passed: x
Failed: y
Skipped: z (Only showed if some tests are skipped)

<Total time>
```

## Resources

* [TAP - The Test Anything Protocol](https://testanything.org/tap-specification.html)
* [TAP - The Test Anything Protocol Version 13](https://testanything.org/tap-version-13-specification.html)

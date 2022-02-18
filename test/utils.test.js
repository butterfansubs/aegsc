const assert = require('assert/strict');
const { pipe } = require('../src/utils');

describe('pipe', function() {
  it('should apply a single function', function() {
    const fn = pipe(
      (a, b) => `${a + b}z`
    );
    const expected = '5z';

    const actual = fn(2, 3);

    assert.equal(actual, expected);
  });

  it('should apply many functions from left to right', function() {
    const fn = pipe(
      (a, b) => `${a + b}z`,
      (x) => x + 'y',
      (x) => x + 'x'
    );
    const expected = '5zyx';

    const actual = fn(2, 3);

    assert.equal(actual, expected);
  });
});

const assert = require('assert/strict');
const { compile } = require('../src/compiler');

describe('compile', function() {
  it('should compile empty input', function() {
    const input = '';
    const expected = ''

    const actual = compile(input);

    assert.equal(actual, expected);
  });
});

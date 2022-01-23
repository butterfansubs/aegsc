const assert = require('assert/strict');
const { extractTemplateLines } = require('../src/parse');

describe('extractTemplateLines', function() {
  it('should return empty for no input', function() {
    const input = '';
    const expected = [];

    const actual = extractTemplateLines(input);

    assert.deepEqual(actual, expected);
  });
});

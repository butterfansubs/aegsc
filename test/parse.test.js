const assert = require('assert/strict');
const { extractTemplateLines } = require('../src/parse');

describe('extractTemplateLines', function() {
  it('should return empty for no input', function() {
    const input = '';
    const expected = [];

    const actual = extractTemplateLines(input);

    assert.deepEqual(actual, expected);
  });

  it('should ignore non-template text', function() {
    const input = 'no such template';
    const expected = [];

    const actual = extractTemplateLines(input);

    assert.deepEqual(actual, expected);
  });

  it('should extract a template line', function() {
    const input = `%[a%]`;
    const expected = ['a'];

    const actual = extractTemplateLines(input);

    assert.deepEqual(actual, expected);
  });

  it('should extract a template line with newlines and trim whitespace', function() {
    const input = `%[\na\n%]`;
    const expected = ['a'];

    const actual = extractTemplateLines(input);

    assert.deepEqual(actual, expected);
  });
});

const assert = require('assert/strict');
const { extractTemplateLines, parseTemplateLine } = require('../src/parse');

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

  it('should extract multiple template lines', function() {
    const input = `
%[
  a
%]
Template 2
%[
  b
  c
%]
    `;
    const expected = ['a', 'b\n  c'];

    const actual = extractTemplateLines(input);

    assert.deepEqual(actual, expected);
  });
});

describe('parseTemplateLine', function() {
  it('should return default object on empty input', function() {
    const input = '';
    const expected = {
      layer: 0,
      actor: '',
      effect: '',
      text: '',
    };

    const actual = parseTemplateLine(input);

    assert.deepEqual(actual, expected);
  });
});

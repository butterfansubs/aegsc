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
  it('should return object with empty effect and text on empty input', function() {
    const input = '';
    const expected = {
      effect: '',
      text: '',
    };

    const actual = parseTemplateLine(input);

    assert.deepEqual(actual, expected);
  });

  it('should parse fields', function() {
    const input = `template syl ^ Dialogue # comment @ 0 < 0:12:34.56 > 1:23:45.67 $ romaji
{
    \\pos($sx, $sy)
}`;
    const expected = {
      type: 'Dialogue',
      layer: '0',
      startTime: '0:12:34.56',
      endTime: '1:23:45.67',
      style: 'romaji',
      actor: 'comment',
      effect: 'template syl',
      text: '{\n    \\pos($sx, $sy)\n}',
    };

    const actual = parseTemplateLine(input);

    assert.deepEqual(actual, expected);
  });

  it('should preserve escaped sigil characters in the header', function() {
    const input = 'template syl # \\@actor \\\\ \\#1 @ 1';
    const expected = {
      layer: '1',
      actor: '@actor \\ #1',
      effect: 'template syl',
      text: '',
    };

    const actual = parseTemplateLine(input);

    assert.deepEqual(actual, expected);
  });

  it('should allow the header to span multiple lines by escaping the newline', function() {
    const input = String.raw`a \
b c\
       d\
e \
# actor $ style \
@ 1
text 1
text 2`;
    const expected = {
      layer: '1',
      actor: 'actor',
      style: 'style',
      effect: 'a b c d e',
      text: 'text 1\ntext 2',
    };

    const actual = parseTemplateLine(input);

    assert.deepEqual(actual, expected);
  });
});

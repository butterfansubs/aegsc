const assert = require('assert/strict');
const { formatEvent } = require('../src/format');

describe('formatEvent', function() {
  it('should output a formatted ASS Comment event', function() {
    const input = {
      type: 'Comment',
      layer: 1,
      startTime: '0:12:34.56',
      endTime: '1:23:45.67',
      style: 'Style',
      actor: 'Actor',
      marginL: '2',
      marginR: '3',
      marginV: '4',
      effect: 'Effect',
      text: 'Text',
    };
    const expected = 'Comment: 1,0:12:34.56,1:23:45.67,Style,Actor,2,3,4,Effect,Text';

    const actual = formatEvent(input);

    assert.deepEqual(actual, expected);
  });
});

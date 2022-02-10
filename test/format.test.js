const assert = require('assert/strict');
const { formatEvent, minifyLua } = require('../src/format');

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

describe('minifyLua', function() {
  it('should minify Lua code', function() {
    const input = String.raw`
      function pos(x, y)
        local v -- comment
        --[[
        multi
        line
        comment
        ]]
        if true then
          v = true
        else
          v = false
        end
        return [[\pos(x,y)]]
      end
    `;
    const expected = String.raw`function pos(a,b)local c;if true then c=true else c=false end;return[[\pos(x,y)]]end`;

    const actual = minifyLua(input);

    assert.equal(actual, expected);
  });

  it('should handle dollar variables correctly', function() {
    const input = String.raw`
      function pos()
        return ([[\pos(%d,%d)]]):format($x, $y)
      end
    `;
    const expected = String.raw`function pos()return([[\pos(%d,%d)]]):format($x,$y)end`;

    const actual = minifyLua(input);

    assert.equal(actual, expected);
  });
});

const assert = require('assert/strict');
const {
  formatEvent,
  minifyASSText,
  minifyLua,
  minifyTemplate,
} = require('../src/format');

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

describe('minifyASSText', function() {
  it('should replace newlines with spaces outside override blocks', function() {
    const input = `a\nb\nc`;
    const expected = 'a b c';

    const actual = minifyASSText(input);

    assert.equal(actual, expected);
  });

  it('should remove newlines inside override blocks', function() {
    const input = '{\na\nb\nc\n}';
    const expected = '{abc}';

    const actual = minifyASSText(input);

    assert.equal(actual, expected);
  });

  it('should trim leading whitespace in source lines', function() {
    const input = String.raw`{
      \fax3\fay4    
    } 
    a  
    b
    c    `;
    const expected = String.raw`{\fax3\fay4    } a   b c    `;

    const actual = minifyASSText(input);

    assert.equal(actual, expected);
  });
});

describe('minifyTemplate', function() {
  it('should remove newlines', function() {
    const input = String.raw`{
\pos($x,$y)
\c&HFFFFFF&
}`;
    const expected = String.raw`{\pos($x,$y)\c&HFFFFFF&}`;

    const actual = minifyTemplate(input);

    assert.equal(actual, expected);
  });

  it('should trim leading and trailing spaces', function() {
    const input = String.raw`
    {
      \pos($x,$y)
      \c&HFFFFFF&
    }`;
    const expected = String.raw`{\pos($x,$y)\c&HFFFFFF&}`;

    const actual = minifyTemplate(input);

    assert.equal(actual, expected);
  });

  it('should minify embeded Lua', function() {
    const input = String.raw`
    {
      \pos(
        !$x + 50!,
        !$y + 50!
      )
      !1 -- comment
        and "\\c&HFFFFFF&"
        or "\\c&H000000&"
      !
      !"\\fnImpact"!
    }`;
    const expected = String.raw`{\pos(!$x+50!,!$y+50!)!1 and"\\c&HFFFFFF&"or"\\c&H000000&"!!"\\fnImpact"!}`;

    const actual = minifyTemplate(input);

    assert.equal(actual, expected);
  });

  it('should preserve string newlines in embedded Lua', function() {
    // This case probably has no practical use, but it's required to ensure that
    // the meaning of the minified code has not changed.

    const input = String.raw`
    {
      !1
        and [[
\\c&HFFFFFF&
\\3c&HFFFFFF&
]]
        or "\\c&H000000&"
      !
    }`;
    const expected = String.raw`{!1 and[[
\\c&HFFFFFF&
\\3c&HFFFFFF&
]]or"\\c&H000000&"!}`;

    const actual = minifyTemplate(input);

    assert.equal(actual, expected);
  });
});

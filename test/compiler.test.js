const assert = require('assert/strict');
const { compile } = require('../src/compiler');

describe('compile', function() {
  it('should compile empty input', function() {
    const input = '';
    const expected = ''

    const actual = compile(input);

    assert.equal(actual, expected);
  });

  it('should compile one template block', function() {
    const input = String.raw`Outside 1
%[ template line ^ Comment @ 1 < 0:12:34.567 > 1:23:45.678 $ Alternate # Actor =L 10 =R 20 =V 30
  { %; Comment in override
    \pos(!
      $x
        + 10 -- Add 10
    !,! %; Comment in inline code
      $y
        + 20
    !)
    \c&H000000&
  }
  %; %] Comment containing end marker
  Line: %; Comment outside override
%] Outside 2
`;
    const expected = String.raw`Comment: 1,0:12:34.567,1:23:45.678,Alternate,Actor,10,20,30,template line,{\pos(!$x+10!,!$y+20!)\c&H000000&}Line:`;

    const actual = compile(input);

    assert.equal(actual, expected);
  });

  it('should compile one code block', function() {
    const input = String.raw`Outside 1
%[ code line ^ Comment @ 1 < 0:12:34.567 > 1:23:45.678 $ Alternate # Actor =L 10 =R 20 =V 30
  %; Aegs Comment
  -- Lua comment
  function xModYPlusZ(x, y)
    local z = 5
    return x % y + 5 %; 6
    --[[
      Lua multiline %; Comment
    ]]
  end
%] Outside 2
`;
    const expected = String.raw`Comment: 1,0:12:34.567,1:23:45.678,Alternate,Actor,10,20,30,code line,function xModYPlusZ(a,b)local c=5;return a%b+5 end`;

    const actual = compile(input);

    assert.equal(actual, expected);

  });
});

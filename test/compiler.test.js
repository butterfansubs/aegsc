const assert = require('assert/strict');
const { compile } = require('../src/compiler');

describe('compile', function() {
  it('should compile empty input', function() {
    const input = '';
    const expected = '';

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

  it('should compile multiple mixed blocks', function() {
    const input = String.raw`Outside 1
%[ template line ^ Comment @ 1 < 0:12:34.567 > 1:23:45.678 $ Template1 # Actor =L 10 =R 20 =V 30
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
%]
Outside 2
%[ code line ^ Comment @ 10 < 3:45:67.890 > 2:34:56.789 $ Code1 # Actor2 =L 10 =R 20 =V 30
  %; Aegs Comment
  -- Lua comment
  function xModYPlusZ(x, y)
    local z = 5
    return x % y + 5 %; 6
    --[[
      Lua multiline %; Comment
    ]]
  end
%]
Outside 3
%[ code once ^ Comment @ 20 < 4:56:78.999 > 5:67:89.000 $ Code2 # Actor3 =L 11 =R 21 =V 31
  %; Aegs Comment
  -- Lua comment
  function xModYPlusZ2(x, y)
    local z = 5
    return x % y + 15 %; 16
    --[[
      Lua multiline %; Comment
    ]]
  end
%]
%[ template syl ^ Dialog @ 30 < 6:78:90.123 > 7:89:01.234 $ Template2 # Actor4 =L 12 =R 22 =V 32
  { %; Comment in override
    \pos(!
      $x
        + 20 -- Add 20
    !,! %; Comment in inline code
      $y
        + 20
    !)
    \c&HFFFFFF&
  }
  %; %] Comment containing end marker
  Line: %; Comment outside override
%]
`;
    const expected = [
      String.raw`Comment: 1,0:12:34.567,1:23:45.678,Template1,Actor,10,20,30,template line,{\pos(!$x+10!,!$y+20!)\c&H000000&}Line:`,
      String.raw`Comment: 10,3:45:67.890,2:34:56.789,Code1,Actor2,10,20,30,code line,function xModYPlusZ(a,b)local c=5;return a%b+5 end`,
      String.raw`Comment: 20,4:56:78.999,5:67:89.000,Code2,Actor3,11,21,31,code once,function xModYPlusZ2(a,b)local c=5;return a%b+15 end`,
      String.raw`Dialog: 30,6:78:90.123,7:89:01.234,Template2,Actor4,12,22,32,template syl,{\pos(!$x+20!,!$y+20!)\c&HFFFFFF&}Line:`,
    ].join('\n');

    const actual = compile(input);

    assert.equal(actual, expected);
  });

  it('should supply defaults for missing header fields', function() {
    const input = '%[%]';
    const expected = 'Comment: 0,0:00:00.00,0:00:00.00,Default,,0,0,0,,';

    const actual = compile(input);

    assert.equal(actual, expected);
  });
});

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
});

const assert = require('assert/strict');
const { supplyDefaults } = require('../src/defaults');

describe('supplyDefaults', function() {
  it('should return defaults when no arguments are provided', function() {
    const expected = {
      layer: 0,
      startTime: '0:00:00.00',
      endTime: '0:00:00.00',
      style: 'Default',
      actor: '',
      effect: '',
      text: '',
    };

    const actual = supplyDefaults();

    assert.deepEqual(actual, expected);
  });
});

const assert = require('assert/strict');
const { supplyDefaults } = require('../src/defaults');

describe('supplyDefaults', function() {
  it('should return defaults when no arguments are provided', function() {
    const expected = {
      type: 'Comment',
      layer: '0',
      startTime: '0:00:00.00',
      endTime: '0:00:00.00',
      style: 'Default',
      actor: '',
      marginL: '0',
      marginR: '0',
      marginV: '0',
      effect: '',
      text: '',
    };

    const actual = supplyDefaults();

    assert.deepEqual(actual, expected);
  });

  it('should supply defaults for missing fields', function() {
    const input = {
      layer: '1',
      actor: 'Name',
      effect: 'template line',
      text: '{}',
    };
    const expected = {
      type: 'Comment',
      layer: '1',
      startTime: '0:00:00.00',
      endTime: '0:00:00.00',
      style: 'Default',
      actor: 'Name',
      marginL: '0',
      marginR: '0',
      marginV: '0',
      effect: 'template line',
      text: '{}',
    };

    const actual = supplyDefaults(input);

    assert.deepEqual(actual, expected);
  });

  it('should not modify the original object', function() {
    const input = {};
    const expected = {};

    supplyDefaults(input);

    assert.deepEqual(input, expected);
  });
});

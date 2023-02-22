const assert = require('assert').strict;
const { AssDefaults } = require('../src/defaults');

describe('AssDefaults', function() {
  let instance;

  beforeEach(function() {
    instance = new AssDefaults();
  });

  describe('.supplyDefaults', function() {
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

      const actual = instance.supplyDefaults();

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

      const actual = instance.supplyDefaults(input);

      assert.deepEqual(actual, expected);
    });

    it('should not modify the original object', function() {
      const input = {};
      const expected = {};

      instance.supplyDefaults(input);

      assert.deepEqual(input, expected);
    });
  });

  describe('.setDefaults', function() {
    it('should set the defaults for supplyDefaults', function() {
      const input = {
        type: 'Dialogue',
        layer: '1',
        startTime: '0:12:34.56',
        endTime: '1:23:45.67',
        style: 'romaji',
        actor: 'comment',
        marginL: '97',
        marginR: '98',
        marginV: '99',
        effect: 'template syl',
        text: '{\n    \\pos($sx, $sy)\n}',
      };
      const expected = {
        type: 'Dialogue',
        layer: '1',
        startTime: '0:12:34.56',
        endTime: '1:23:45.67',
        style: 'romaji',
        actor: 'comment',
        marginL: '97',
        marginR: '98',
        marginV: '99',
        effect: 'template syl',
        text: '{\n    \\pos($sx, $sy)\n}',
      };

      instance.setDefaults(input);
      const actual = instance.supplyDefaults({});

      assert.deepEqual(actual, expected);
    });

    it('should use the existing defaults for any missing fields', function() {
      const oldDefaults = {
        type: 'Dialogue',
        layer: '1',
        startTime: '0:12:34.56',
        endTime: '1:23:45.67',
        style: 'romaji',
        actor: 'comment',
        marginL: '97',
        marginR: '98',
        marginV: '99',
        effect: 'template syl',
        text: '{\n    \\pos($sx, $sy)\n}',
      };
      const newDefaults = {};
      const expected = {
        type: 'Dialogue',
        layer: '1',
        startTime: '0:12:34.56',
        endTime: '1:23:45.67',
        style: 'romaji',
        actor: 'comment',
        marginL: '97',
        marginR: '98',
        marginV: '99',
        effect: 'template syl',
        text: '{\n    \\pos($sx, $sy)\n}',
      };

      instance.setDefaults(oldDefaults);
      instance.setDefaults(newDefaults);
      const actual = instance.supplyDefaults({});

      assert.deepEqual(actual, expected);
    });
  });
});

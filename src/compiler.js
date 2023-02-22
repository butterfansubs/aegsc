const { pipe } = require('./utils');
const {
  extractTemplateBlocks,
  removeComments,
  parseTemplateBlock,
} = require('./parse');
const {
  formatEvent,
  minifyASSText,
  minifyLua,
  minifyTemplate,
} = require('./format');
const { AssDefaults } = require('./defaults');

const minifier = {
  code: minifyLua,
  template: minifyTemplate,
  mixin: minifyTemplate,
};

const processor = Object.assign(Object.create(null), {
  'set-defaults': (defaults) => (block) => {
    defaults.setDefaults(block);
    return [];
  },
  'karatemplate': (defaults) => pipe(
    defaults.supplyDefaults.bind(defaults),
    ({ effect, text, ...event }) => {
      const type = effect.split(/\s/)[0];
      const minify = minifier[type] ?? minifyASSText;

      return {
        ...event,
        effect,
        text: minify(text)
      };
    },
    formatEvent
  ),
});

function processBlock(defaults) {
  return (...args) => {
    const { _directive = 'karatemplate', ...block } = parseTemplateBlock(...args);
    const process = processor[_directive] ?? (() => () => []);
    return process(defaults)(block);
  };
}

function compile(input) {
  const defaults = new AssDefaults();

  return pipe(
    removeComments,
    extractTemplateBlocks,
    (blocks) => blocks.flatMap(processBlock(defaults)),
    (lines) => lines.join('\n')
  )(input);
};

module.exports = {
  compile,
};

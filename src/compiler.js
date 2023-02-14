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

function processBlock(defaults) {
  return pipe(
    parseTemplateBlock,
    defaults.supplyDefaults,
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
  )
}

function compile(input) {
  const defaults = new AssDefaults();

  return pipe(
    removeComments,
    extractTemplateBlocks,
    (blocks) => blocks.map(processBlock(defaults)),
    (lines) => lines.join('\n')
  )(input);
};

module.exports = {
  compile,
};

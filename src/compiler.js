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
const { supplyDefaults } = require('./defaults');

const minifier = {
  code: minifyLua,
  template: minifyTemplate,
  mixin: minifyTemplate,
};

const processBlock = pipe(
  parseTemplateBlock,
  supplyDefaults,
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
);

function compile(input) {
  return pipe(
    removeComments,
    extractTemplateBlocks,
    (blocks) => blocks.map(processBlock),
    (lines) => lines.join('\n')
  )(input);
};

module.exports = {
  compile,
};

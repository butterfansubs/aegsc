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

const processBlock = pipe(
  parseTemplateBlock,
  ({ effect, text, ...event }) => ({
    ...event,
    effect,
    text: effect.startsWith('code') ? minifyLua(text) : minifyTemplate(text),
  }),
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

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
  ({ text, ...event }) => ({ ...event, text: minifyTemplate(text) }),
  formatEvent
);

function compile(input) {
  return pipe(
    removeComments,
    extractTemplateBlocks,
    (blocks) => blocks.map(processBlock),
    (lines) => lines.join('')
  )(input);
};

module.exports = {
  compile,
};
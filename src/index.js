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
const { compile } = require('./compiler');

module.exports = {
  AssDefaults,
  compile,
  extractTemplateBlocks,
  formatEvent,
  minifyASSText,
  minifyLua,
  minifyTemplate,
  parseTemplateBlock,
  removeComments,
};

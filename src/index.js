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
const { compile } = require('./compiler');

module.exports = {
  compile,
  extractTemplateBlocks,
  formatEvent,
  minifyASSText,
  minifyLua,
  minifyTemplate,
  parseTemplateBlock,
  removeComments,
};

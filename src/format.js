const luamin = require('luamin');

function formatEvent({
  type,
  layer,
  startTime,
  endTime,
  style,
  actor,
  marginL,
  marginR,
  marginV,
  effect,
  text,
}) {
  return `${type}: ` + [
    layer,
    startTime,
    endTime,
    style,
    actor,
    marginL,
    marginR,
    marginV,
    effect,
    text,
  ].join(',');
}

function minifyLua(code) {
  const dollar = '____DOLLAR____';
  const safeCode = code.replaceAll('$', dollar);
  const minified = luamin.minify(safeCode);
  return minified.replaceAll(dollar, '$');
}

module.exports = {
  formatEvent,
  minifyLua,
};

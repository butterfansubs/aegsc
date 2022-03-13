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
  const safeCode = code.replace(/\$/g, dollar);
  const minified = luamin.minify(safeCode);
  return minified.replace(new RegExp(dollar, 'g'), '$');
}

function minifyASSText(ass) {
  return ass
    .split(/(\{[^}]*\}[^\S\n]*)/)
    .map((token) => (
      token
        .split('\n')
        .filter((line, index) => index !== 0 || line.length) // removes newlines immediately after override blocks
        .map((line) => line.trimStart())
        .join(/^\{.*\}\s*$/s.test(token) ? '' : ' ')
    ))
    .join('');
}

function minifyTemplate(template) {
  return template
    .split(/(![^!]*!)/)
    .flatMap((token) => {
      const codeBlock = /^!(.*)!$/s.exec(token);

      if (codeBlock) {
        const [, code] = codeBlock;
        const minified = minifyLua(`return (${code})`).replace(/return ?/, '');
        return `!${minified}!`;
      } else {
        return token
          .split('\n')
          .map((line) => line.trim());
      }
    })
    .join('');
}

module.exports = {
  formatEvent,
  minifyASSText,
  minifyLua,
  minifyTemplate,
};

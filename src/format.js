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
    .split('\n')
    .map((line) => line.trimStart())
    .join('');
}

function minifyTemplate(template) {
  const [textSegments, codeSegments] = template
    .split(/!([^!]*)!/)
    .reduce((acc, segment, index) => {
      acc[index % 2].push(segment);
      return acc;
    }, [[], []]);

  const minifiedTextSegments = minifyASSText(textSegments.join('!!')).split('!!');
  const minifiedCodeSegments = codeSegments.map((segment) => {
    // Aegisub's karaoke templater only wraps the code segment in `return (...)`,
    // but luamin will only sometimes strip the parentheses.
    // Wrap the expression in syntax that will not be reduced so it can be
    // consistently stripped.
    const minified = minifyLua(`return x(${segment})`).replace(/return x\((.*)\)/s, '$1');
    return `!${minified}!`;
  });

  return String.raw({ raw: minifiedTextSegments }, ...minifiedCodeSegments);
}

module.exports = {
  formatEvent,
  minifyASSText,
  minifyLua,
  minifyTemplate,
};

function extractTemplateLines(text) {
  return (text.match(/(?<=%\[).*?(?=%\])/gs) ?? [])
    .map((line) => line.trim());
}

const sigilMap = {
  '@': 'layer',
  '#': 'actor',
};

function parseTemplateLine(templateLine) {
  const parsedTemplate = {
    layer: 0,
    actor: '',
    effect: '',
    text: '',
  };

  const [header, ...text] = templateLine.split('\n');
  parsedTemplate.text = text.join('\n').trim();

  const [effect, ...headerTokens] = header.split(/(?<!\\)([@#])/).map((token) => token.trim());
  parsedTemplate.effect = effect;

  let tokens = headerTokens;
  while (tokens.length) {
    const [sigil, value, ...rest] = tokens;

    if (sigil in sigilMap) {
      parsedTemplate[sigilMap[sigil]] = value.replace(/\\(.)/g, '$1');
    }

    tokens = rest;
  }

  return parsedTemplate;
}

module.exports = {
  extractTemplateLines,
  parseTemplateLine,
};

function extractTemplateBlocks(text) {
  return (text.match(/(?<=%\[).*?(?=%\])/gs) ?? [])
    .map((block) => block.trim());
}

function removeComments(text) {
  return text
    .split('\n')
    .filter((line) => !/^\s*%;/.test(line))
    .map((line) => line.replace(/%;.*$/, ''))
    .join('\n');
}

const sigilMap = {
  '^': 'type',
  '@': 'layer',
  '<': 'startTime',
  '>': 'endTime',
  '$': 'style',
  '#': 'actor',
  '=L': 'marginL',
  '=R': 'marginR',
  '=V': 'marginV',
};

function parseTemplateBlock(templateBlock) {
  const parsedTemplate = {};

  const [header, ...text] = templateBlock.split(/(?<!\\)\n/);
  parsedTemplate.text = text.join('\n').trim();

  const [effect, ...headerTokens] = header
    .split('\\\n')
    .map((block) => block.trim())
    .join(' ')
    .split(/(?<!\\)([@<>$#^]|=[LRV])/)
    .map((token) => token.trim());
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
  extractTemplateBlocks,
  removeComments,
  parseTemplateBlock,
};

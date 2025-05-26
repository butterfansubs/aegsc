function extractTemplateBlocks(text) {
  return Array.from(text.matchAll(/%\[((?:[^%]|%[^\]])*)%\]/gs) ?? [])
    .map(([, multiBlock]) => ({ type: 'block', content: multiBlock }));
}

function removeComments(text) {
  return text
    .split('\n')
    .filter((line) => !/^\s*%;/.test(line))
    .map((line) => line.replace(/\s?%;.*$/, ''))
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

function parseMultilineTemplateBlock({ content }) {
  const parsedTemplate = {};

  const [directiveMatch, directive] = content.match(/^\s*!([^,\n\s]*)\s*,/) ?? [];
  if (directive) {
    parsedTemplate._directive = directive;
    content = content.slice(directiveMatch.length);
  }

  const [header, ...text] = content.split(/(?<!\\)\n/);
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

function parseTemplateBlock(templateBlock) {
  const blockParse = {
    block: parseMultilineTemplateBlock,
  }[templateBlock.type] ?? (() => undefined);

  return blockParse(templateBlock);
}

module.exports = {
  extractTemplateBlocks,
  removeComments,
  parseTemplateBlock,
};

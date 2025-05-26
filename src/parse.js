function extractTemplateBlocks(text) {
  return Array.from(text.matchAll(/(?:%\[((?:[^%]|%[^\]])*)%\])|(?:%!([^\n]*))/gs) ?? [])
    .map(([, multiBlock, lineBlock]) => (
      multiBlock !== undefined
        ? { type: 'block', content: multiBlock }
        : { type: 'line', content: lineBlock }
    ));
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
const sigilRegex = /(?<!\\)([@<>$#^]|=[LRV])/;
const parseBlockConfigs = {
  line: {
    directiveRegex: /^\s*!([^,|\s]*)\s*,/,
    bodySeparatorRegex: /(?<!\\)\|/,
  },
  block: {
    directiveRegex: /^\s*!([^,\n\s]*)\s*,/,
    bodySeparatorRegex: /(?<!\\)\n/,
  },
};

function parseTemplateBlock(templateBlock) {
  let { type, content } = templateBlock;
  const config = parseBlockConfigs[type];
  if (!config) throw new Error(`Unknown block type: ${type}`, { cause: templateBlock });

  const parsedTemplate = {};

  const [directiveMatch, directive] = content.match(config.directiveRegex) ?? [];
  if (directive) {
    parsedTemplate._directive = directive;
    content = content.slice(directiveMatch.length);
  }

  const [header, ...text] = content.split(config.bodySeparatorRegex);
  parsedTemplate.text = text.join('\n').trim();

  const [effect, ...headerTokens] = header
    .split('\\\n')
    .map((block) => block.trim())
    .join(' ')
    .split(sigilRegex)
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

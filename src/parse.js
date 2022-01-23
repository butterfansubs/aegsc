function extractTemplateLines(text) {
  return (text.match(/(?<=%\[).*?(?=%\])/gs) ?? [])
    .map((line) => line.trim());
}

function parseTemplateLine(templateLine) {
  return {
    layer: 0,
    actor: '',
    effect: '',
    text: '',
  };
}

module.exports = {
  extractTemplateLines,
  parseTemplateLine,
};

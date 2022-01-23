function extractTemplateLines(text) {
  const [templateLine] = text.match(/(?<=%\[).*(?=%\])/) ?? [];

  return templateLine ? [templateLine] : [];
}

module.exports = {
  extractTemplateLines,
};

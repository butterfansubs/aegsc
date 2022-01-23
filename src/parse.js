function extractTemplateLines(text) {
  const [templateLine] = text.match(/(?<=%\[).*(?=%\])/s) ?? [];

  return templateLine ? [templateLine.trim()] : [];
}

module.exports = {
  extractTemplateLines,
};

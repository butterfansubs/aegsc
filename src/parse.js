function extractTemplateLines(text) {
  return (text.match(/(?<=%\[).*?(?=%\])/gs) ?? [])
    .map((line) => line.trim());
}

module.exports = {
  extractTemplateLines,
};

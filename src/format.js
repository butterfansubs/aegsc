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

module.exports = {
  formatEvent,
};

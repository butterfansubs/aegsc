// https://www.30secondsofcode.org/js/s/pipe-functions
function pipe(...fns) {
  return fns.reduce((f, g) => (...args) => g(f(...args)));
}

module.exports = {
  pipe,
};

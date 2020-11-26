const { AssertionError } = require('assert');

/**
 * Adapted from https://github.com/sindresorhus/float-equal
 * License evidence: https://github.com/sindresorhus/float-equal/blob/master/license
 * @author Sindre Sorhus + fork contributions from Alex Birch
 * @license MIT
 * @param {number} a
 * @param {number} b
 * @param {tolerance} b
 */
const assertFloatEqual = (a, b, tolerance = Number.EPSILON) => {
	if (a === b) {
		return;
  }

	const diff = Math.abs(a - b);

	if (diff < tolerance) {
		return;
	}

	if (diff <= tolerance * Math.min(Math.abs(a), Math.abs(b))) {
    return;
  }
  
  throw new AssertionError({
    operator: `within ${tolerance} of`,
    expected: `${b} (difference: ${diff})`,
    actual: a
  });
};

module.exports = {
  assertFloatEqual
};
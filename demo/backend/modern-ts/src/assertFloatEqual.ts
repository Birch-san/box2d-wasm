import { AssertionError } from 'assert';

/**
 * Adapted from https://github.com/sindresorhus/float-equal
 * License evidence: https://github.com/sindresorhus/float-equal/blob/master/license
 * @author Sindre Sorhus + fork contributions from Alex Birch
 * @license MIT
 */
export const assertFloatEqual = (a: number, b: number, tolerance: number = Number.EPSILON): void => {
	if (a === b) {
		return;
  }

	const diff: number = Math.abs(a - b);

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
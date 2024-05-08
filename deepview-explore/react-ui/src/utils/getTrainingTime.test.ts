import { describe, it, expect } from 'vitest';
import { getTrainingTime } from './getTrainingTime';

describe('Training time helper', () => {
	it.each([
		[1, 0, 1, 0],
		[1, 1, 1, 1 / 3.6e6]
	])('correctly gets the correct training time from values %n', (iterations, x, gpus, output) => {
		expect(getTrainingTime(iterations, x, gpus)).toEqual(output);
	});
});

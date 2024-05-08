import { describe, it, expect } from 'vitest';
import { formatNumber } from './formatNumber';

describe('Format number helper', () => {
	it.each([
		[10, '10'],
		[100, '100'],
		[1000, '1 thousand'],
		[1000000000000, '1 trillion']
	])('correctly formats the number value %n', (input, output) => {
		expect(formatNumber(input)).toEqual(output);
	});
});

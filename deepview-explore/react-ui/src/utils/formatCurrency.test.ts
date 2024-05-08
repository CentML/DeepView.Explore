import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('Format currency helper', () => {
	it.each([
		[1, '$1'],
		[10, '$10'],
		[1000, '$1K'],
		[1000000, '$1M']
	])('correctly formats the currency value %n', (input, output) => {
		expect(formatCurrency(input)).toEqual(output);
	});
});

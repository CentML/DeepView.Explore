import { test, expect } from 'vitest';
import { formatHomeEnergyUsed } from './formatHomeEnergyUsed';

test('Home energy used format', () => {
	expect(formatHomeEnergyUsed(1)).toStrictEqual([1, 'year']);
	expect(formatHomeEnergyUsed(1e-1)).toStrictEqual([36.5, 'day']);
	expect(formatHomeEnergyUsed(1e-3)).toStrictEqual([8.76, 'hour']);
	expect(formatHomeEnergyUsed(1e-4)).toStrictEqual([52.56, 'minute']);
	expect(formatHomeEnergyUsed(1e-6)).toStrictEqual([31.54, 'second']);
	expect(formatHomeEnergyUsed(1e-8)).toStrictEqual([315.36, 'msec']);
});

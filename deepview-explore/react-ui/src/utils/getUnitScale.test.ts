import { test, expect } from 'vitest';
import { getUnitScale } from './getUnitScale';

test('Unit Scale', () => {
	// Energy
	expect(getUnitScale(40, 'energy')).toStrictEqual({ scale: 'J', scale_index: 0, val: 40 });
	expect(getUnitScale(4.1e3, 'energy')).toStrictEqual({ scale: 'KJ', scale_index: 1, val: 4.1 });
	expect(getUnitScale(4.1e5, 'energy')).toStrictEqual({ scale: 'KJ', scale_index: 1, val: 410 });
	expect(getUnitScale(4.1e6, 'energy')).toStrictEqual({ scale: 'MJ', scale_index: 2, val: 4.1 });
	expect(getUnitScale(4.1e8, 'energy')).toStrictEqual({ scale: 'MJ', scale_index: 2, val: 410 });
	expect(getUnitScale(4.1e9, 'energy')).toStrictEqual({ scale: 'GJ', scale_index: 3, val: 4.1 });
	expect(getUnitScale(4.1e11, 'energy')).toStrictEqual({ scale: 'GJ', scale_index: 3, val: 410 });
	expect(getUnitScale(4.1e12, 'energy')).toStrictEqual({ scale: 'TJ', scale_index: 4, val: 4.1 });
	expect(getUnitScale(4.1e14, 'energy')).toStrictEqual({ scale: 'TJ', scale_index: 4, val: 410 });
	expect(getUnitScale(4.1e15, 'energy')).toStrictEqual({ scale: 'PJ', scale_index: 5, val: 4.1 });
	expect(getUnitScale(4.1e17, 'energy')).toStrictEqual({ scale: 'PJ', scale_index: 5, val: 410 });
	expect(getUnitScale(4.1e18, 'energy')).toStrictEqual({ scale: 'EJ', scale_index: 6, val: 4.1 });
	// Generic
	expect(getUnitScale(40, 'generic')).toStrictEqual({ scale: '', scale_index: 0, val: 40 });
	expect(getUnitScale(400, 'generic')).toStrictEqual({ scale: '', scale_index: 0, val: 400 });
	expect(getUnitScale(4e3, 'generic')).toStrictEqual({ scale: 'Thousands', scale_index: 1, val: 4.0 });
	expect(getUnitScale(4.2e5, 'generic')).toStrictEqual({ scale: 'Thousands', scale_index: 1, val: 420 });
	expect(getUnitScale(4.2e6, 'generic')).toStrictEqual({ scale: 'Millions', scale_index: 2, val: 4.2 });
	expect(getUnitScale(4.2e8, 'generic')).toStrictEqual({ scale: 'Millions', scale_index: 2, val: 420 });
	expect(getUnitScale(4.2e9, 'generic')).toStrictEqual({ scale: 'Billions', scale_index: 3, val: 4.2 });
	expect(getUnitScale(4.2e11, 'generic')).toStrictEqual({ scale: 'Billions', scale_index: 3, val: 420 });
	expect(getUnitScale(4.2e12, 'generic')).toStrictEqual({ scale: 'Trillion', scale_index: 4, val: 4.2 });
	expect(getUnitScale(4.2e14, 'generic')).toStrictEqual({ scale: 'Trillion', scale_index: 4, val: 420 });
	expect(getUnitScale(4.2e15, 'generic')).toStrictEqual({ scale: 'Quadrillion', scale_index: 5, val: 4.2 });
});

import { test, expect } from 'vitest';
import { getEnergyData } from './getEnergyData';

test('energy conversion', () => {
	const totalEnergy = 1.84e6;
	expect(getEnergyData(totalEnergy)).toStrictEqual({
		kwh: 0.51,
		carbon: '0.22 kg',
		miles: '0.55 ',
		household: [14.65, 'minute'],
		phone: '26.92 '
	});
});

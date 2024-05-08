const ENERGY_UNITS = ['J', 'KJ', 'MJ', 'GJ', 'TJ', 'PJ', 'EJ'];

const GENERIC_UNITS = ['', 'Thousands', 'Millions', 'Billions', 'Trillion', 'Quadrillion'];

export function getUnitScale(quantity: number, unit: 'energy' | 'generic') {
	let index = 0;
	while (quantity > 1000) {
		quantity /= 1000;
		index++;
	}

	switch (unit) {
		case 'energy':
			return {
				val: parseFloat(Number(quantity).toFixed(2)),
				scale: ENERGY_UNITS[index],
				scale_index: index
			};
		case 'generic':
			return {
				val: parseFloat(Number(quantity).toFixed(2)),
				scale: GENERIC_UNITS[index],
				scale_index: index
			};
		default:
			return {
				val: 0,
				scale: '',
				scale_index: 0
			};
	}
}

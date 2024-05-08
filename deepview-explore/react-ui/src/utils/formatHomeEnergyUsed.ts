const FORMAT_TIME_UNITS = [
	[365, 'day'],
	[24, 'hour'],
	[60, 'minute'],
	[60, 'second'],
	[1000, 'msec']
] as const;

export function formatHomeEnergyUsed(quantity: number) {
	if (quantity >= 1) {
		return [parseFloat(Number(quantity).toFixed(2)), 'year'];
	}

	let index = 0;
	let converter = FORMAT_TIME_UNITS[index];
	while (quantity < 1) {
		converter = FORMAT_TIME_UNITS[index];
		quantity *= converter[0];
		index++;
	}

	return [parseFloat(Number(quantity).toFixed(2)), converter[1]];
}

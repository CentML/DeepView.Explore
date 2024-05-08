import { getUnitScale } from './getUnitScale';
import { formatHomeEnergyUsed } from './formatHomeEnergyUsed';
import { ENERGY_CONVERSION_UNITS } from './constants';

export interface EnergyData {
	kwh: number;
	carbon: string;
	miles: string;
	household: (string | number)[];
	phone: string;
}

export function getEnergyData(currentTotal: number) {
	const kwh = currentTotal * ENERGY_CONVERSION_UNITS.kwh;
	const carbon_emission_tons = kwh * ENERGY_CONVERSION_UNITS.carbon;

	const carbon =
		carbon_emission_tons < 1
			? `${parseFloat(Number(carbon_emission_tons * 1000).toFixed(2))} kg`
			: `${parseFloat(Number(carbon_emission_tons).toFixed(2))} Metric Tons`;
	const household = formatHomeEnergyUsed(carbon_emission_tons * ENERGY_CONVERSION_UNITS.household);
	const miles = getUnitScale(carbon_emission_tons * ENERGY_CONVERSION_UNITS.miles, 'generic');
	const phone = getUnitScale(carbon_emission_tons * ENERGY_CONVERSION_UNITS.phone, 'generic');

	return {
		kwh: parseFloat(Number(kwh).toFixed(2)),
		carbon,
		miles: `${miles?.val} ${miles?.scale}`,
		household,
		phone: `${phone?.val} ${phone?.scale}`
	};
}

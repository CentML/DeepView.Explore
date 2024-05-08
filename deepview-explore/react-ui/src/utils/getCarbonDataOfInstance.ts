import { getUnitScale } from './getUnitScale';
import { formatHomeEnergyUsed } from './formatHomeEnergyUsed';
import { ENERGY_CONVERSION_UNITS } from './constants';

const GPU_NAMES = ['k520', 'a10g', 't4', 'm60', 'k80', 'v100', 'a100', 'p4', 'p100'] as const;

type GpuName = (typeof GPU_NAMES)[number];

interface Power {
	MIN_WATTS: Record<GpuName, number>;
	MAX_WATTS: Record<GpuName, number>;
}

const GPU_POWER: Power = {
	MIN_WATTS: {
		k520: 26,
		a10g: 18,
		t4: 8,
		m60: 35,
		k80: 35,
		v100: 35,
		a100: 46,
		p4: 9,
		p100: 36
	},
	MAX_WATTS: {
		k520: 229,
		a10g: 156,
		t4: 71,
		m60: 306,
		k80: 306,
		v100: 306,
		a100: 107,
		p4: 76.5,
		p100: 306
	}
};

function getGpuAveragePower(gpu: GpuName) {
	return (GPU_POWER.MAX_WATTS[gpu] - GPU_POWER.MIN_WATTS[gpu]) * 0.5 + GPU_POWER.MIN_WATTS[gpu];
}

export function getCarbonDataOfInstance(time: number, instance, cloudProvider) {
	const carbonData = [];
	for (let index = 0; index < instance.regions.length; index++) {
		const instanceCarbonEmissions =
			getGpuAveragePower(instance.info.gpu) *
			instance.info.ngpus *
			time *
			cloudProvider.regions[instance.regions[index]].emissionsFactor *
			cloudProvider.pue;

		const household = formatHomeEnergyUsed(instanceCarbonEmissions * ENERGY_CONVERSION_UNITS.household);
		const miles = getUnitScale(instanceCarbonEmissions * ENERGY_CONVERSION_UNITS.miles, 'generic');
		const phone = getUnitScale(instanceCarbonEmissions * ENERGY_CONVERSION_UNITS.phone, 'generic');

		carbonData.push({
			regionName: instance.regions[index],
			carbonEmissions: instanceCarbonEmissions,
			miles: `${miles?.val} ${miles?.scale}`,
			household: household,
			phone: `${phone?.val} ${phone?.scale}`
		});
	}

	carbonData.sort((a, b) => (a.carbonEmissions < b.carbonEmissions ? -1 : 1));

	return carbonData;
}

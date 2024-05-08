// reference : https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
export const ENERGY_CONVERSION_UNITS = {
	kwh: 2.77778e-7, // 1J = 2.77778e-7 kwh
	carbon: 4.33e-4, // Electricity consumed (kilowatt-hours) : 7.09 × 10-4 metric tons CO2/kWh
	miles: 1 / 4.03e-4, // Miles driven by the average gasoline-powered passenger vehicle : 4.03 x 10-4 metric tons CO2E/mile
	household: 1 / 7.94, // Home energy use : 7.94 metric tons CO2 per home per year.
	phone: 1 / 8.22e-6 // 8.22 x 10-6 metric tons CO2/smartphone charged
} as const;

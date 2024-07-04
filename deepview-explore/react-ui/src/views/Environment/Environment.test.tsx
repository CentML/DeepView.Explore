import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Environment from './Environment';

const energy = {
	current: {
		total_consumption: 2.3,
		components: [
			{
				type: 'ENERGY_UNSPECIFIED',
				consumption: 0
			},
			{
				type: 'ENERGY_CPU_DRAM',
				consumption: 1.15
			},
			{
				type: 'ENERGY_GPU',
				consumption: 1.15
			}
		],
		batch_size: 4
	},
	past_measurements: []
};

const analysis = {
	energy
};

describe('Enviornment tab', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				epochs: 500,
				iterations: 1000,
				analysis
			})
		}));
	});

	it('renders', () => {
		render(<Environment />);

		expect(screen.getByText(/energy consumption/i)).toBeDefined();
		expect(screen.getByText(/relative impact/i)).toBeDefined();
	});
});

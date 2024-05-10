import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Consumption } from './Consumption';

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

let error = false;

describe('Consumption card', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				epochs: 500,
				iterations: 1000,
				analysis: {
					energy: {
						...energy,
						error
					}
				}
			})
		}));
	});

	it('renders', () => {
		render(<Consumption />);

		expect(screen.getByText(/total consumption/i)).toBeDefined();
		expect(screen.getByText(/emissions released/i)).toBeDefined();
		expect(screen.getByText(/miles driven/i)).toBeDefined();
		expect(screen.getByText(/smartphones charged/i)).toBeDefined();
		expect(screen.getByText(/homes worth/i)).toBeDefined();

		expect(screen.getByRole('link', { name: /epa/i })).toBeDefined();
	});

	it('renders an error view', () => {
		error = true;
		render(<Consumption />);

		expect(screen.getByText(/error/i)).toBeDefined();
	});
});

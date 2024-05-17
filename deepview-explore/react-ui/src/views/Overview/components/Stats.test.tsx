import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Stats } from './Stats';

const operationName = 'fancy_name';
const parentProportion = 5;
const totalProportion = 95;

let throughput = 10;
const utilizationData = {
	allOperations: {
		name: operationName,
		parentProportion,
		totalProportion,
		forward: 50,
		backward: 50
	}
};

describe('Stats card', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				throughput,
				utilizationData,
				analysis: {
					breakdown: {}
				}
			})
		}));

		vi.mock('@utils/vscode');
	});

	it('renders', () => {
		render(<Stats />);

		expect(screen.getByText(throughput.toString())).toBeDefined();
		expect(screen.getAllByText('50%')).toHaveLength(2);
	});

	it('renders empty throughput and utilization', () => {
		throughput = 0;
		utilizationData.allOperations = {};

		render(<Stats />);
		expect(screen.getByText(/no throughput/i)).toBeDefined();
		expect(screen.getByText(/no utilization/i)).toBeDefined();
	});
});

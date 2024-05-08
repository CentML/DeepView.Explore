import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataParallelTraining } from './DataParallelTraining';

const analysis = {
	ddp: {
		fw_time: 25.26932,
		bucket_sizes: [
			20.733, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642, 27.642
		],
		expected_max_compute_times_array: [
			{
				ngpus: 2,
				expected_compute_times: [
					0.43684915, 2.1338165, 2.1202433, 2.1449373, 2.1403136, 2.127142, 2.126013, 2.127965, 2.1399844, 2.1346676, 2.1860871, 2.1681674, 2.170639
				]
			}
		]
	},
	breakdown: {
		peak_usage_bytes: 692299776,
		memory_capacity_bytes: 8589934592,
		iteration_run_time_ms: 188.93123,
		batch_size: 24,
		num_nodes_operation_tree: 56,
		num_nodes_weight_tree: 72,
		operation_tree: []
	}
};

describe('Data parallel training card', () => {
	it('renders', () => {
		render(<DataParallelTraining analysis={analysis} isUsingDdp />);

		expect(screen.getByRole('combobox')).toBeDefined();
		expect(screen.getByRole('combobox')).toHaveProperty('value', 'pcie');
	});

	it('renders empty state', () => {
		render(<DataParallelTraining analysis={{ ddp: {} }} isUsingDdp />);
		expect(screen.getByText(/no ddp/i)).toBeDefined();
	});

	it('renders message if user not using ddp', () => {
		render(<DataParallelTraining analysis={analysis} isUsingDdp={false} />);
		expect(screen.getByText(/not included/i)).toBeDefined();
	});
});

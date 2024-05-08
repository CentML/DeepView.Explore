import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryBatchSize } from './MemoryBatchSize';

const analysis = {
	throughput: {
		samples_per_second: 179.4022216796875,
		predicted_max_samples_per_second: 253.4250946044922,
		run_time_ms: [3.9459390531219505, 5.8745377327263055],
		peak_usage_bytes: [85101998.60686015, 362023034.03342235],
		batch_size_context: 'entry_point.py,11',
		can_manipulate_batch_size: true
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

describe('Memory and batch size card', () => {
	it('renders', () => {
		render(<MemoryBatchSize analysis={analysis} />);

		expect(screen.getAllByRole('slider')).toHaveLength(2);
		screen.getAllByRole('slider').forEach((s) => expect(s).toHaveProperty('max', '100'));
		expect(screen.getByText(/peak usage/i)).toBeDefined();
		expect(screen.getByText(/maximum capacity/i)).toBeDefined();
		expect(screen.getAllByText(/throughput/i)).toHaveLength(2); // slider and heading
		expect(screen.getByText(/predicted maximum/i)).toBeDefined();
		expect(screen.getByText(/using predicted/i)).toBeDefined();
	});
});

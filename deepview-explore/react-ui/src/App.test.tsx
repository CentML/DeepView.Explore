import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

let isLoading = false;
let analysis = {
	project_root: 'root',
	project_entry_point: 'entry',
	hardware_info: {
		gpus: ['a100']
	},
	throughput: {
		samples_per_second: 100,
		predicted_max_samples_per_second: 10,
		run_time_ms: [1, 2, 3],
		peak_usage_bytes: [1],
		batch_size_context: 'ctx',
		can_manipulate_batch_size: false
	},
	breakdown: {},
	epochs: 50,
	iterations: 2000,
	timeBreakDown: {
		fine: [
			{
				file_refs: [{ path: './c', line_no: 85, run_time_ms: 1.0100053548812866, size_bytes: 0 }]
			}
		]
	}
};

describe('App component', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				analysis,
				handleConnection: vi.fn(),
				isLoading,
				utilizationData: {
					allOperations: {}
				}
			})
		}));
	});

	it('renders', () => {
		render(<App />);
		expect(screen.getByAltText(/deepview logo/i)).toBeDefined();
	});

	it('renders loading screen', () => {
		isLoading = true;

		render(<App />);
		expect(screen.getByRole('status')).toBeDefined();

		isLoading = false;
	});

	it('renders welcome page without analysis', () => {
		analysis = {};

		const { rerender } = render(<App />);
		expect(screen.getByRole('button', { name: /begin analysis/i })).toBeDefined();

		analysis.throughput = {};
		rerender(<App />);
		expect(screen.getByRole('button', { name: /begin analysis/i })).toBeDefined();

		analysis.throughput = {};
		rerender(<App />);
		expect(screen.getByRole('button', { name: /begin analysis/i })).toBeDefined();
	});
});

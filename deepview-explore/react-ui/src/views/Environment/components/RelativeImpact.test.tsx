import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProfilingData } from '@interfaces/ProfileData';
import { RelativeImpact } from './RelativeImpact';

describe('Consumption card', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				epochs: 500,
				iterations: 1000
			})
		}));
	});

	it('renders an error view', () => {
		const analysis = {
			energy: {
				error: true
			}
		};

		render(<RelativeImpact analysis={analysis as ProfilingData} />);

		expect(screen.getByText(/error/i)).toBeDefined();
	});
});

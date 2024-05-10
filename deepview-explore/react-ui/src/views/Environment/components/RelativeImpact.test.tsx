import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RelativeImpact } from './RelativeImpact';

describe('Consumption card', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				epochs: 500,
				iterations: 1000,
				analysis: {
					energy: {
						error: true
					}
				}
			})
		}));
	});

	it('renders an error view', () => {
		render(<RelativeImpact />);

		expect(screen.getByText(/error/i)).toBeDefined();
	});
});

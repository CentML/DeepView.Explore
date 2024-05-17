import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Habitat } from './Habitat';

let error = false;
let isDemo = false;

describe('Habitat chart', () => {
	beforeEach(() => {
		vi.mock('@context/useAnalysis', () => ({
			useAnalysis: () => ({
				analysis: {
					habitat: {
						predictions: [],
						isDemo,
						error
					}
				}
			})
		}));
	});

	it('renders', () => {
		render(<Habitat />);
		expect(screen.getByText('DeepView.Predict')).toBeDefined();
	});

	it('renders error state', () => {
		error = true;
		render(<Habitat />);
		expect(screen.getByText(/error/i)).toBeDefined();
		error = false;
	});

	it('renders demo state', () => {
		isDemo = true;
		render(<Habitat />);
		expect(screen.getByText(/not supported/i)).toBeDefined();
	});
});

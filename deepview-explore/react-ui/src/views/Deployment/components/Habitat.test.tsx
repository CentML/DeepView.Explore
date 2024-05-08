import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Habitat } from './Habitat';

describe('Habitat chart', () => {
	it('renders', () => {
		render(<Habitat analysis={{ habitat: { predictions: [] } }} />);
		expect(screen.getByText('DeepView.Predict')).toBeDefined();
	});

	it('renders error state', () => {
		render(<Habitat analysis={{ habitat: { error: true } }} />);
		expect(screen.getByText(/error/i)).toBeDefined();
	});

	it('renders demo state', () => {
		render(<Habitat analysis={{ habitat: { isDemo: true } }} />);
		expect(screen.getByText(/not supported/i)).toBeDefined();
	});
});

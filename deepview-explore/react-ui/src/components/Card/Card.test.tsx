import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Card from './Card';

describe('Card component', () => {
	it('renders', () => {
		const TITLE = 'my card';
		const CONTENT = 'content';

		render(
			<Card title={TITLE}>
				<p>{CONTENT}</p>
			</Card>
		);

		expect(screen.getByText(TITLE)).toBeDefined();
		expect(screen.getByText(CONTENT)).toBeDefined();
	});
});

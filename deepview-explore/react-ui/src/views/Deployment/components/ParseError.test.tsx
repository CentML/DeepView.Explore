import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ParseError } from './ParseError';

describe('Parse error', () => {
	it('renders', () => {
		render(<ParseError errors={[]} />);

		expect(screen.getByText(/error/i)).toBeDefined();
	});

	it('renders list of errors', () => {
		render(
			<ParseError
				errors={[
					{
						msg: 'oh no',
						code: '400',
						invalidFields: [
							{
								field: 'one',
								err: 'two'
							},
							{
								field: 'three',
								err: 'four'
							}
						]
					}
				]}
			/>
		);

		expect(screen.getByText(/oh no/i)).toBeDefined();
		expect(screen.getByText(/400/i)).toBeDefined();
		expect(screen.getByText('one')).toBeDefined();
		expect(screen.getByText('two')).toBeDefined();
		expect(screen.getByText('three')).toBeDefined();
		expect(screen.getByText('four')).toBeDefined();
	});
});

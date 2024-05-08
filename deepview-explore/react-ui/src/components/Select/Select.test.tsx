import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Select } from './Select';

describe('Select component', () => {
	it('renders', () => {
		const LABEL = 'select-label';
		render(<Select id="test-input" label={LABEL} options={[]} />);

		expect(screen.getByRole('combobox', { name: LABEL })).toBeDefined();
	});

	it('it renders list of options', () => {
		const OPTIONS = ['one', 'two', 'three'];
		render(<Select id="test" label="testing" options={OPTIONS} />);

		OPTIONS.forEach((o) => {
			expect(screen.getByRole('option', { name: o })).toBeDefined();
		});
	});

	it('selects an option', () => {
		const onChange = vi.fn();
		render(<Select id="test" label="testing" options={['one']} onChange={onChange} />);

		fireEvent.change(screen.getByRole('combobox'), { target: { value: 'one' } });
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});

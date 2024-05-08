import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NumberInput from './NumberInput';

describe('Card component', () => {
	it('renders', () => {
		const LABEL = 'number-input';
		render(<NumberInput id="test-input" label={LABEL} />);

		expect(screen.getByRole('textbox', { name: LABEL })).toBeDefined();
	});

	it('can only be updated with numbers', () => {
		const onChange = vi.fn();
		render(<NumberInput id="test" label="testing" onChange={onChange} />);

		fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
		expect(onChange).not.toHaveBeenCalled();

		fireEvent.change(screen.getByRole('textbox'), { target: { value: '123' } });
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});

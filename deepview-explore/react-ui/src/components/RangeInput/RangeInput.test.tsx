import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import RangeInput from './RangeInput';

describe('Select component', () => {
	it('renders', () => {
		const LABEL = 'range';
		render(<RangeInput id="test-input" label={LABEL} />);

		expect(screen.getByRole('slider', { name: LABEL })).toBeDefined();
		expect(screen.getByText(LABEL).className).toEqual('sr-only');
	});

	it('changes value', () => {
		const onChange = vi.fn();
		render(<RangeInput id="test-input" label="range" onChange={onChange} />);

		fireEvent.change(screen.getByRole('slider'), { target: { value: 10 } });
		expect(onChange).toHaveBeenCalledTimes(1);
	});
});

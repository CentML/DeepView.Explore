import { fireEvent, render, screen } from '@testing-library/react';
import { TooltipModel } from 'chart.js';
import { describe, expect, it } from 'vitest';
import { GraphTooltip, useGraphTooltip } from './GraphTooltip';

describe('Graph tooltip', () => {
	it('renders', () => {
		render(
			<GraphTooltip showTooltip>
				<p>tooltip</p>
			</GraphTooltip>
		);

		expect(screen.getByText('tooltip')).toBeDefined();
	});

	it('does not render tooltip', () => {
		render(
			<GraphTooltip>
				<p>tooltip</p>
			</GraphTooltip>
		);

		expect(screen.queryByText('tooltip')).toBe(null);
	});
});

describe('useGraphToolTip hook', () => {
	const TestComponent = () => {
		const { chartRef, showTooltip, toggleTooltip } = useGraphTooltip();

		return (
			<div ref={chartRef}>
				{showTooltip && <p>tooltip</p>}
				<button onClick={() => toggleTooltip({ opacity: 1 } as TooltipModel<'bar'>)}>toggle</button>
			</div>
		);
	};

	it('toggles the tooltip', () => {
		render(<TestComponent />);

		expect(screen.queryByText('tooltip')).toBe(null);

		fireEvent.click(screen.getByRole('button'));
		expect(screen.getByText('tooltip')).toBeDefined();
	});
});

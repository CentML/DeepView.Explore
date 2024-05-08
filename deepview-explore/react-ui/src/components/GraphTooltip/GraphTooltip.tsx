import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { ChartType, TooltipModel } from 'chart.js';

export const useGraphTooltip = () => {
	const [showTooltip, setShowTooltip] = useState(false);
	const chartRef = useRef(null);

	const toggleTooltip = <T extends ChartType>(chartJsTooltip: TooltipModel<T>) => {
		if (!chartRef || !chartRef.current) return;

		if (chartJsTooltip.opacity === 0) {
			setShowTooltip(false);
			return;
		}

		if (!showTooltip) setShowTooltip(true);
	};

	return { chartRef, showTooltip, toggleTooltip };
};

interface GraphTooltipProps extends PropsWithChildren {
	showTooltip?: boolean;
}

export const GraphTooltip = ({ children, showTooltip }: GraphTooltipProps) => {
	const [position, setPosition] = useState({
		top: 0,
		left: 0
	});

	const tooltipRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			setPosition({
				top: e.clientY,
				left: e.clientX
			});
		}

		window.addEventListener('mousemove', handleMouseMove);

		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	if (!showTooltip) return null;

	const isWiderThanWindow = position.left + 150 > window.innerWidth;
	const top = position.top + scrollY - (tooltipRef.current?.offsetHeight ?? 0) / 2;

	return (
		<div
			ref={tooltipRef}
			className="border-1 z-100 absolute rounded-md border-surface-500 bg-white p-2 shadow-2xl"
			style={{
				top,
				left: isWiderThanWindow ? undefined : position.left + 20,
				right: isWiderThanWindow ? window.innerWidth - position.left : undefined
			}}
		>
			{children}
		</div>
	);
};

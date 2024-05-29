import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import RangeInput from '@components/RangeInput';
import { RANGE_HEIGHT } from '@components/RangeInput/RangeInput';
import LoadingSpinner from '@components/LoadingSpinner';
import { getUsageData, INITIAL_SLIDER_STATE } from '@utils/getUsageData';
import { MIN_HEIGHT } from './constants';

interface MemoryUsageData {
	batchSize: number;
	memory: [number, number, number];
	throughput: [number, number, number];
}

const useMockData = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MOCKS;

export const MemoryBatchSize = () => {
	const { analysis } = useAnalysis();
	const { throughput, breakdown } = analysis;
	const [usageData, setUsageData] = useState<MemoryUsageData>({ batchSize: 0, memory: INITIAL_SLIDER_STATE, throughput: INITIAL_SLIDER_STATE });

	useEffect(() => {
		if (!Object.keys(breakdown).length || !Object.keys(throughput).length) return;

		if (useMockData) {
			const data = getUsageData(analysis, 0.5, null, undefined);
			if (!data) return;

			const { memory, throughput } = data;
			setUsageData((prev) => ({
				...prev,
				memory,
				throughput
			}));
		} else {
			const data = getUsageData(analysis, null, null, breakdown.batch_size);
			if (!data) return;

			const { memory, throughput } = data;
			setUsageData((prev) => ({
				...prev,
				memory,
				throughput
			}));
		}
	}, []);

	const handleUpdateSlider = (percentage: number, type: 'memory' | 'throughput') => {
		let data;
		if (type === 'memory') {
			data = getUsageData(analysis, percentage, null, undefined);
		}

		if (type === 'throughput') {
			data = getUsageData(analysis, null, percentage, undefined);
		}

		if (!data) return;

		setUsageData(data);
	};

	const showThroughputSlider = !isFinite(usageData.throughput[2]) || isNaN(usageData.throughput[2]);

	if (!Object.keys(throughput).length || !Object.keys(breakdown).length) {
		return (
			<Card title="Memory and batch size">
				<LoadingSpinner />
			</Card>
		);
	}

	return (
		<Card title="Memory and batch size">
			<div className={`flex flex-col justify-between ${MIN_HEIGHT}`}>
				<div className="flex items-center justify-around">
					<div className="flex gap-4" style={{ height: !showThroughputSlider ? RANGE_HEIGHT : 'auto' }}>
						{!showThroughputSlider && (
							<RangeInput
								id="memory-range"
								hideLabel
								label="Memory usage"
								onChange={(e) => handleUpdateSlider(Math.round(Number(e.target.value)), 'memory')}
								value={Math.round(usageData.memory[0])}
								max={100}
							/>
						)}
						<div className="flex flex-col items-center justify-center gap-2">
							<UsageDisplay title="Peak usage" value={usageData.memory[1]} unit="megabytes" />
							<div className="border-1 w-full border-surface-200" />
							<UsageDisplay title="Maximum capacity" value={usageData.memory[2]} unit="megabytes" />
						</div>
					</div>

					<div className="flex gap-4" style={{ height: !showThroughputSlider ? RANGE_HEIGHT : 'auto' }}>
						{!showThroughputSlider ? (
							<>
								<RangeInput
									id="throughput-range"
									hideLabel
									label="Throughput"
									onChange={(e) => handleUpdateSlider(Math.round(Number(e.target.value)), 'throughput')}
									value={Math.round(usageData.throughput[0])}
									max={100}
								/>
								<div className="flex flex-col items-center justify-center gap-2">
									<UsageDisplay title="Throughput" value={usageData.throughput[1]} unit="samples/second" />
									<div className="border-1 w-full border-surface-200" />
									<UsageDisplay title="Predicted maximum" value={usageData.throughput[2]} unit="samples/second" />
								</div>
							</>
						) : (
							<UsageDisplay title="Throughput" value={Math.round(analysis.throughput.samples_per_second)} unit="samples/second" />
						)}
					</div>
				</div>

				{!!showThroughputSlider && (
					<div className="flex items-center justify-center">
						<Alert variant="warning">
							<Icon icon={faWarning} size="1x" className="mr-1" />
							Further increasing the batch size will not increase throughput. Consider other options to increase training throughput.
						</Alert>
					</div>
				)}

				<p className="text-center text-sm" style={{ opacity: usageData.batchSize === 0 ? 0 : 1 }}>
					Using predicted batch size <strong>{Math.round(usageData.batchSize)}</strong>
				</p>
			</div>
		</Card>
	);
};

interface UsageDisplayProps {
	title: string;
	value: number;
	unit: string;
}

const UsageDisplay = ({ title, value, unit }: UsageDisplayProps) => {
	const formatNumber = (n: number) => {
		if (isNaN(n)) return n;
		if (n > 0 && Number(n.toFixed(0)) === 0) return '< 1';
		return n.toFixed(0);
	};

	return (
		<div className="flex flex-col items-center justify-center gap-2 text-center">
			<p className="text-sm">{title}</p>
			<p className="text-5xl">{formatNumber(value)}</p>
			<p className="text-sm">{unit}</p>
		</div>
	);
};

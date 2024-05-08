import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import Card from '@components/Card';
import RangeInput from '@components/RangeInput';
import { ProfilingData } from '@interfaces/ProfileData';
import { GPU_MAX_CAPACITY_LIMIT } from '@data/properties';
import { RANGE_HEIGHT } from '@components/RangeInput/RangeInput';

interface MemoryBatchSizeProps {
	analysis: ProfilingData;
}

interface MemoryUsageData {
	batchSize: number;
	memory: number[];
	throughput: number[];
}

const INITIAL_SLIDER_STATE = [50, 69, 420];

const useMockData = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MOCKS;

export const MemoryBatchSize = ({ analysis }: MemoryBatchSizeProps) => {
	const [usageData, setUsageData] = useState<MemoryUsageData>({ batchSize: 0, memory: INITIAL_SLIDER_STATE, throughput: INITIAL_SLIDER_STATE });

	useEffect(() => {
		if (useMockData) {
			const data = handleUpdate(0.5, null);
			if (!data) return;

			const { memory, throughput } = data;
			setUsageData((prev) => ({
				...prev,
				memory,
				throughput
			}));
		} else {
			const data = handleUpdate(null, null, true);
			if (!data) return;

			const { memory, throughput } = data;
			setUsageData((prev) => ({
				...prev,
				memory,
				throughput
			}));
		}
	}, []);

	function handleUpdate(memoryPercentage: number | null, throughputPercentage: number | null, useBatchSize = false) {
		const { throughput, breakdown } = analysis;
		const memoryModel = throughput.peak_usage_bytes;
		const throughputModel = throughput.run_time_ms;
		const maxBatch = Math.floor((GPU_MAX_CAPACITY_LIMIT * breakdown.memory_capacity_bytes - memoryModel[1]) / memoryModel[0]);
		const maxMemory = breakdown.memory_capacity_bytes;
		const maxThroughput = (maxBatch * 1000.0) / (maxBatch * throughputModel[0] + throughputModel[1]);

		let batchSize = 0;
		if (!useBatchSize) {
			if (!memoryPercentage && !throughputPercentage) return;

			if (memoryPercentage) {
				batchSize = Math.floor((memoryPercentage * maxBatch) / 100.0);
			}

			if (throughputPercentage) {
				const tp = (throughputPercentage * maxThroughput) / 100.0;
				batchSize = Math.floor(tp * throughputModel[1]) / (1000.0 - tp * throughputModel[0]);
			}

			batchSize = Math.max(1, Math.min(batchSize, maxBatch));
		}

		const m = batchSize * memoryModel[0] + memoryModel[1];
		const tp = (batchSize * 1000.0) / (batchSize * throughputModel[0] + throughputModel[1]);

		return {
			batchSize,
			memory: [(100.0 * m) / maxMemory, m / 1e6, maxMemory / 1e6],
			throughput: [(100.0 * tp) / maxThroughput, tp, Math.max(maxThroughput, tp)]
		};
	}

	const handleUpdateSlider = (percentage: number, type: 'memory' | 'throughput') => {
		let data;
		if (type === 'memory') {
			data = handleUpdate(percentage, null);
		}

		if (type === 'throughput') {
			data = handleUpdate(null, percentage);
		}

		if (!data) return;

		setUsageData(data);
	};

	const showThroughputSlider = !isFinite(usageData.throughput[2]) || isNaN(usageData.throughput[2]);

	return (
		<Card title="Memory and batch size">
			<div className="flex min-h-[500px] flex-col justify-between">
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
							<>
								<UsageDisplay title="Throughput" value={Math.round(analysis.throughput.samples_per_second)} unit="samples/second" />
								<Alert variant="warning">
									<Icon icon={faWarning} size="1x" className="mr-1" />
									Further increasing the batch size will not increase throughput. Consider other options to increase training throughput.
								</Alert>
							</>
						)}
					</div>
				</div>

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

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from '@components/Card';
import { useAnalysis } from '@context/useAnalysis';
import { GPU_MAX_CAPACITY_LIMIT } from '@data/properties';

ChartJS.register(ArcElement, Tooltip);

const useMockData = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MOCKS;

export const Stats = () => {
	const { analysis, utilizationData, throughput } = useAnalysis();
	const noUtilization = !utilizationData || Object.keys(utilizationData.allOperations).length === 0;

	function getMemoryUsage(memoryPercentage: number | null, useBatchSize = false) {
		if (!analysis || !Object.keys(analysis.breakdown).length || !Object.keys(analysis.throughput).length) return [0, 0];

		const { throughput: analysisThroughput, breakdown } = analysis;
		const memoryModel = analysisThroughput.peak_usage_bytes;
		const maxBatch = Math.floor((GPU_MAX_CAPACITY_LIMIT * breakdown.memory_capacity_bytes - memoryModel[1]) / memoryModel[0]);
		const maxMemory = breakdown.memory_capacity_bytes;

		let batchSize = 0;
		if (!useBatchSize) {
			if (!memoryPercentage) return [];

			if (memoryPercentage) {
				batchSize = Math.floor((memoryPercentage * maxBatch) / 100.0);
			}

			batchSize = Math.max(1, Math.min(batchSize, maxBatch));
		}

		const m = batchSize * memoryModel[0] + memoryModel[1];

		return [Math.round(m / 1e6), Math.round(maxMemory / 1e6)];
	}

	const memory = useMockData ? getMemoryUsage(0.5) : getMemoryUsage(null, true);

	return (
		<Card title="Overview stats">
			<div className="grid grid-cols-1 gap-6 mdplus:grid-cols-3 mdplus:gap-0">
				<div className="flex flex-col items-center">
					<h3 className="font-semibold">Throughput</h3>
					<div className="border-1 my-2 w-[100px] border-surface-200" />

					<div className="flex grow flex-col items-center justify-center">
						{!throughput || isNaN(throughput) || throughput === Infinity ? (
							<p className="text-sm opacity-60">No throughput data</p>
						) : (
							<>
								<p className="text-8xl">
									<strong>{throughput}</strong>
								</p>
								<p className="text-sm opacity-60">samples/second</p>
							</>
						)}
					</div>
				</div>

				<div className="flex flex-col items-center">
					<h3 className="font-semibold">Memory Usage</h3>
					<div className="border-1 my-2 w-[100px] border-surface-200" />
					<Doughnut
						className="max-h-[150px] p-2"
						options={{ locale: 'en-us', responsive: true, plugins: { datalabels: { display: false }, legend: { display: false } } }}
						data={{
							labels: ['Peak Usage', 'Total Memory'],
							datasets: [{ label: '', data: memory, backgroundColor: ['rgba(0, 67, 49, 1)', 'rgba(0, 168, 123, 0.3)'] }]
						}}
					/>
					<p className="text-sm opacity-60">{memory ? memory[0] : ''} megabytes</p>
				</div>

				{noUtilization ? (
					<div className="flex grow flex-col">
						<h3 className="mb-2">Utilization</h3>
						<div className="border-1 w-25 m-auto my-2 border-surface-200" />
						<p className="text-sm opacity-60">No utilization data</p>
					</div>
				) : (
					<div className="flex flex-col items-center">
						<h3 className="font-semibold">Utilization</h3>
						<div className="border-1 my-2 w-[100px] border-surface-200" />

						<div className="flex grow items-center gap-8 text-center">
							<div>
								<p className="text-6xl">
									<strong>{utilizationData.allOperations.forward}%</strong>
								</p>
								<p className="text-sm opacity-60">Forward</p>
							</div>

							<div>
								<p className="text-6xl">
									<strong>{utilizationData.allOperations.backward}%</strong>
								</p>
								<p className="text-sm opacity-60">Backward</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</Card>
	);
};

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Card from '@components/Card';
import { useAnalysis } from '@context/useAnalysis';

ChartJS.register(ArcElement, Tooltip);

export const Stats = () => {
	const { analysis, statsUsage, utilizationData } = useAnalysis();
	const { memory, throughput } = statsUsage;
	const noUtilization = !utilizationData || Object.keys(utilizationData.allOperations).length === 0;

	return (
		<Card title="Overview stats">
			<div className="grid grid-cols-1 gap-6 mdplus:grid-cols-3 mdplus:gap-0">
				<div className="flex flex-col items-center">
					<h3 className="font-semibold">Throughput</h3>
					<div className="border-1 my-2 w-[100px] border-surface-200" />

					<div className="flex grow flex-col items-center justify-center">
						{!throughput[0] || isNaN(throughput[0]) || throughput[0] === Infinity ? (
							<>
								<p className="text-6xl">
									<strong>{Math.round(analysis.throughput.samples_per_second)}</strong>
								</p>
								<p className="text-sm opacity-60">samples/second</p>
							</>
						) : (
							<>
								<p className="text-8xl">
									<strong>{Math.round(throughput[1])}</strong>
								</p>
								<p className="text-sm opacity-60">samples/second</p>
							</>
						)}
					</div>
				</div>

				<div className="flex grow flex-col items-center justify-center">
					<h3 className="font-semibold">Memory Usage</h3>
					<div className="border-1 my-2 w-[100px] border-surface-200" />
					{!memory[0] && !memory[1] ? (
						<p className="text-sm italic">No memory usage</p>
					) : (
						<>
							<Doughnut
								className="max-h-[150px] p-2"
								options={{ locale: 'en-us', responsive: true, plugins: { datalabels: { display: false }, legend: { display: false } } }}
								data={{
									labels: ['Peak Usage', 'Total Memory'],
									datasets: [{ label: '', data: memory.map((m) => Math.round(m)), backgroundColor: ['rgba(0, 67, 49, 1)', 'rgba(0, 168, 123, 0.3)'] }]
								}}
							/>
							<p className="text-sm opacity-60">{memory ? Math.round(memory[1]) : ''} megabytes</p>
						</>
					)}
				</div>

				{noUtilization ? (
					<div className="flex grow flex-col items-center">
						<h3 className="mb-2 font-semibold">Utilization</h3>
						<div className="border-1 w-25 m-auto my-2 border-surface-200" />
						<div className="flex grow flex-col items-center justify-center">
							<p className="text-sm italic">No utilization data</p>
						</div>
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

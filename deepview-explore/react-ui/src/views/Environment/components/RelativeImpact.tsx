import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import { ProfilingData } from '@interfaces/ProfileData';
import { getUnitScale } from '@utils/getUnitScale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CURRENT_LABEL = 'Current profiling';

interface RelativeImpactProps {
	analysis: ProfilingData;
}

export const RelativeImpact = ({ analysis }: RelativeImpactProps) => {
	const { epochs, iterations } = useAnalysis();
	const totalIterations = epochs * iterations;

	const { energy } = analysis;

	if (energy.error) {
		return (
			<Card title="Relative impact">
				<div className="flex items-center justify-center">
					<Alert variant="danger">
						<Icon icon={faCircleExclamation} size="1x" className="mr-1" />
						There was an error generating impact analysis
					</Alert>
				</div>
			</Card>
		);
	}

	const { current, past_measurements } = energy;
	const currentCPU = current.components.find(({ type }) => type === 'ENERGY_CPU_DRAM');
	const currentGPU = current.components.find(({ type }) => type === 'ENERGY_GPU');
	const pastProfiling = past_measurements.flatMap((p, i) => {
		if (p.total_consumption && p.components) {
			const cpu = p.components.find(({ type }) => type === 'ENERGY_CPU_DRAM');
			const gpu = p.components.find(({ type }) => type === 'ENERGY_GPU');

			if (cpu && gpu) {
				return {
					label: `Exp no. ${i + 1}`,
					total: (p.total_consumption * totalIterations * current.batch_size) / p.batch_size,
					cpu: (cpu.consumption * totalIterations * current.batch_size) / p.batch_size,
					gpu: (gpu.consumption * totalIterations * current.batch_size) / p.batch_size
				};
			}
		}

		return [];
	});

	const data = [
		{
			label: CURRENT_LABEL,
			total: current.total_consumption * totalIterations,
			cpu: (currentCPU?.consumption ?? 0) * totalIterations,
			gpu: (currentGPU?.consumption ?? 0) * totalIterations
		},
		...pastProfiling
	].sort((a, b) => a.total - b.total);
	const max = data[data.length - 1];
	const scaling = getUnitScale(max.total, 'energy');
	const graphScaling = 10 ** (scaling.scale_index * 3);

	const graphData = data.map(({ total, cpu, gpu, ...rest }) => ({
		...rest,
		total: total / graphScaling,
		cpu: cpu / graphScaling,
		gpu: gpu / graphScaling
	}));

	const currentProfilingIndex = graphData.findIndex(({ label }) => label === CURRENT_LABEL);
	const energyScale = scaling.scale;

	return (
		<Card title="Relative impact">
			<div className="flex flex-col gap-4">
				<h2 className="text-xl">Compared to your other experiments</h2>
				<Bar
					className="max-h-[500px]"
					options={{
						locale: 'en-us',
						responsive: true,
						maintainAspectRatio: false,
						plugins: {
							datalabels: {
								formatter: (_, { dataset: { label }, dataIndex }) => {
									if (dataIndex === currentProfilingIndex && label === 'GPU') return '◆';
									return null;
								},
								align: 'top',
								offset: 4,
								labels: {
									title: {
										font: {
											size: 16
										}
									}
								}
							},
							legend: {
								labels: {
									font: {
										size: 12
									},
									boxHeight: 10,
									boxWidth: 10
								},
								position: 'bottom',
								align: 'end'
							}
						},
						scales: {
							y: {
								grid: {
									display: false
								},
								title: {
									text: `Energy consumption (${energyScale})`,
									display: true,
									font: {
										size: 14
									}
								},
								stacked: true
							},
							x: {
								ticks: {
									font: ({ index }) => {
										if (index === currentProfilingIndex)
											return {
												weight: 'bold'
											};
										return undefined;
									}
								},
								grid: {
									display: false
								},
								title: {
									text: 'Experiments',
									display: true,
									font: {
										size: 14
									}
								},
								stacked: true
							}
						}
					}}
					data={{
						labels: graphData.map(({ label }) => label),
						datasets: [
							{
								label: 'CPU',
								data: graphData.map(({ cpu }) => cpu),
								backgroundColor: '#5499c7'
							},
							{
								label: 'GPU',
								data: graphData.map(({ gpu }) => gpu),
								backgroundColor: '#17a589'
							}
						]
					}}
				/>
			</div>
		</Card>
	);
};

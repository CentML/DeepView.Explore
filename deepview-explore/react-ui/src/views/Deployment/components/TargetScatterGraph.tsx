import { useEffect, useState } from 'react';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { ButtonGroup, Form, ToggleButton } from 'react-bootstrap';
import Select from '@components/Select';
import { GraphTooltip, useGraphTooltip } from '@components/GraphTooltip/GraphTooltip';
import { formatCurrency } from '@utils/formatCurrency';
import { DeploymentLogo } from './DeploymentLogo';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export interface GraphData {
	label: string;
	data: {
		id: number;
		x: number;
		y: number;
		gpu: string;
		ngpus: number;
	}[];
	backgroundColor: string;
}

interface TargetScatterGraphProps {
	cloudProviders: string[];
	data: GraphData[];
	gpus: string[];
	handleMultipleSelected: () => void;
	handleSelection: (id?: number) => void;
}

interface Tip {
	label: string;
	time: number;
	cost: number;
}

const NUMBER_OF_GPUS = [1, 2, 4, 8, 0] as const; // 0 is all

export const TargetScatterGraph = ({ cloudProviders, data, gpus, handleMultipleSelected, handleSelection }: TargetScatterGraphProps) => {
	const [graphData, setGraphData] = useState(data);
	const [filters, setFilters] = useState({
		provider: 'All',
		gpu: 'All',
		ngpus: 0
	});
	const [deploymentTip, setDeploymentTip] = useState<Tip[]>([]);

	const { chartRef, showTooltip, toggleTooltip } = useGraphTooltip();

	useEffect(() => {
		const filtered = data
			.filter(({ label }) => (filters.provider === 'All' ? true : label === filters.provider))
			.map((d) => ({
				...d,
				data: d.data.filter(({ gpu }) => (filters.gpu === 'All' ? true : gpu === filters.gpu))
			}))
			.map((d) => ({
				...d,
				data: d.data.filter(({ ngpus }) => (filters.ngpus === 0 ? true : ngpus === filters.ngpus))
			}));

		setGraphData(filtered);
	}, [filters, data]);

	const handleFilterChange = (value: number | string, key: keyof typeof filters) => {
		setFilters((prev) => ({
			...prev,
			[key]: value
		}));
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-row gap-2">
					<Select
						id="cloud-provider"
						label="Cloud provider"
						options={['All', ...cloudProviders]}
						value={filters.provider}
						onChange={(e) => handleFilterChange(e.target.value, 'provider')}
					/>
					<Select
						id="gpu-hardware"
						label="GPU"
						options={['All', ...gpus]}
						value={filters.gpu}
						onChange={(e) => handleFilterChange(e.target.value, 'gpu')}
					/>
				</div>

				<Form.Group className="flex flex-col">
					<Form.Label className="mb-1 text-sm font-semibold">Number of GPUs </Form.Label>
					<ButtonGroup>
						{NUMBER_OF_GPUS.map((n) => (
							<ToggleButton
								key={n}
								id={`toggle-${n}`}
								className={`${n === filters.ngpus ? 'border-none !bg-primary-500 text-white' : ''} px-2 text-xs font-semibold`}
								type="radio"
								value={n}
								checked={n === filters.ngpus}
								onClick={() => handleFilterChange(n, 'ngpus')}
								variant="light"
							>
								{n === 0 ? 'All' : n}
							</ToggleButton>
						))}
					</ButtonGroup>
				</Form.Group>
			</div>
			{graphData.length === 0 ? (
				<p className="text-center text-sm font-semibold text-error-500">No data for your selection</p>
			) : (
				<Scatter
					className="max-h-[500px]"
					ref={chartRef}
					options={{
						locale: 'en-us',
						responsive: true,
						plugins: {
							datalabels: {
								display: false
							},
							legend: {
								labels: {
									font: {
										size: 12
									},
									boxHeight: 10,
									boxWidth: 10
								},
								align: 'end'
							},
							tooltip: {
								enabled: false,
								external: ({ tooltip }) => {
									toggleTooltip(tooltip);

									const tip = tooltip.dataPoints.map(({ dataset, parsed }) => ({
										label: dataset.label ?? '',
										time: parsed.x,
										cost: parsed.y
									}));

									if (JSON.stringify(tip) !== JSON.stringify(deploymentTip)) {
										setDeploymentTip(tip);
									}
								}
							}
						},
						onClick: (_, element) => {
							if (element.length > 1) {
								handleSelection(undefined);
								handleMultipleSelected();
							}

							if (element.length === 1) {
								const { datasetIndex, index } = element[0];

								const point = graphData[datasetIndex].data[index];
								handleSelection(point.id);
							}
						},
						elements: {
							point: {
								radius: 8,
								hoverRadius: 10,
								hoverBorderWidth: 1
							}
						},
						scales: {
							y: {
								beginAtZero: true,
								title: {
									text: 'Total cost (USD)',
									display: true,
									font: {
										size: 14
									}
								}
							},
							x: {
								title: {
									text: 'Total training time (hrs)',
									display: true,
									font: {
										size: 14
									}
								}
							}
						}
					}}
					data={{
						datasets: graphData
					}}
				/>
			)}
			<GraphTooltip showTooltip={showTooltip}>
				<div className="flex gap-2">
					{deploymentTip.map(({ label, cost, time }, i) => (
						<div key={i} className="flex flex-col items-center">
							<DeploymentLogo className="mb-1 h-6" logo={label} />

							<p className="text-xs">{formatCurrency(cost)} USD</p>
							<p className="text-xs">{time.toFixed(2)} hrs</p>
						</div>
					))}
				</div>
			</GraphTooltip>
		</div>
	);
};

import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import Select from '@components/Select';
import LoadingSpinner from '@components/LoadingSpinner';
import type { Breakdown, Ddp } from '@interfaces/ProfileData';
import { getDdpGraphData } from '@utils/ddpHelpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const DataParallelTraining = () => {
	const { analysis, isUsingDdp } = useAnalysis();
	const { breakdown, ddp } = analysis;

	const [linkFilter, setLinkFilter] = useState<'pcie' | 'nvlink'>('pcie');

	if (isUsingDdp && (!Object.keys(breakdown).length || !Object.keys(ddp).length)) {
		return (
			<Card title="Data-Parallel training">
				<LoadingSpinner />
			</Card>
		);
	}

	if (!isUsingDdp) {
		return (
			<Card title="Data-Parallel training">
				<div className="flex items-center justify-center">
					<Alert variant="info">
						<Icon icon={faInfoCircle} size="1x" className="mr-1" />
						DDP Analysis was not included
					</Alert>
				</div>
			</Card>
		);
	}

	let graphData;
	if (Object.keys(ddp).length && !ddp.error && Object.keys(breakdown).length) {
		graphData = getDdpGraphData(ddp as Ddp, breakdown as Breakdown);
	}

	if (ddp.error) {
		return (
			<Card title="Data-Parallel training">
				<div className="flex items-center justify-center">
					<Alert variant="danger">
						<Icon icon={faCircleExclamation} size="1x" className="mr-1" />
						There was an error generating DDP analysis
					</Alert>
				</div>
			</Card>
		);
	}

	if (!graphData) {
		return (
			<Card title="Data-Parallel training">
				<div className="flex items-center justify-center">
					<p>No DDP analysis available</p>
				</div>
			</Card>
		);
	}

	return (
		<Card title="Data-Parallel training">
			<div className="flex min-h-max flex-col justify-between gap-4 md:min-h-[500px]">
				<div className="flex items-start">
					<Select
						id="link-type"
						label="Link type"
						options={['pcie', 'nvlink']}
						value={linkFilter}
						onChange={(e) => setLinkFilter(e.target.value as 'pcie' | 'nvlink')}
					/>
				</div>
				<Bar
					options={{
						locale: 'en-us',
						responsive: true,
						plugins: {
							legend: {
								display: false
							},
							datalabels: {
								display: false
							}
						},
						scales: {
							y: {
								grid: {
									display: false
								},
								title: {
									text: 'Throughput (samples/s)',
									display: true,
									font: {
										size: 14
									}
								}
							},
							x: {
								grid: {
									display: false
								},
								title: {
									text: 'Number of GPUs',
									display: true,
									font: {
										size: 14
									}
								}
							}
						}
					}}
					data={{
						labels: graphData[linkFilter].map(({ name }) => name),
						datasets: [
							{
								data: graphData[linkFilter].map(({ value }) => value),
								backgroundColor: '#00a87b'
							}
						]
					}}
				/>
			</div>
		</Card>
	);
};

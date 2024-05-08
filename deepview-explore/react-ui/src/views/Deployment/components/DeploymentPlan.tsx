import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CloseButton, Table } from 'react-bootstrap';
import { GraphTooltip, useGraphTooltip } from '@components/GraphTooltip/GraphTooltip';
import { getTrainingTime } from '@utils/getTrainingTime';
import { formatCurrency } from '@utils/formatCurrency';
import { getCarbonDataOfInstance } from '@utils/getCarbonDataOfInstance';
import type { CloudProviders } from '@utils/parsers';
import { DeploymentLogo } from './DeploymentLogo';
import { EnvironmentalAssessmentTooltip, type RegionData } from './EnvironmentalAssessmentTooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export interface Instance {
	id: number;
	x: number;
	y: number;
	info: {
		instance: string;
		gpu: string;
		vcpus: number;
		ram: number;
		ngpus: number;
		cost: number;
		provider: string;
	};
	regions?: string[];
	vmem?: number;
	fill: string;
	z: number;
}

interface DeploymentPlanProps {
	closeDeploymentPlan: () => void;
	cloudProviders: CloudProviders[];
	instance: Instance;
	totalIterations: number;
}

export const DeploymentPlan = ({ closeDeploymentPlan, cloudProviders, instance, totalIterations }: DeploymentPlanProps) => {
	const [carbonData, setCarbonData] = useState<ReturnType<typeof getCarbonDataOfInstance> | undefined>(undefined);
	const [regionData, setRegionData] = useState<RegionData | undefined>(undefined);

	const { chartRef, showTooltip, toggleTooltip } = useGraphTooltip();

	const time = getTrainingTime(totalIterations, instance.x, instance.info.ngpus);
	const cost = instance.info.cost * time;
	const instanceProvider = cloudProviders.find(({ name }) => name === instance.info.provider);

	useEffect(() => {
		if (instance.regions && instanceProvider) {
			const res = getCarbonDataOfInstance(time, instance, instanceProvider);
			setCarbonData(res);
		}
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row items-start gap-4">
				<DeploymentLogo className="max-w-20" logo={instance.info.provider} />

				<div>
					<h2 className="text-xl font-bold">{instance.info.instance}</h2>
					<p className="text-sm">
						Estimated cost: <strong>{formatCurrency(cost)}</strong>
					</p>
					<p className="text-sm">
						Estimated training time: <strong>{time.toFixed(2)} Hours</strong>
					</p>
				</div>

				<CloseButton className="ml-auto" onClick={() => closeDeploymentPlan()} />
			</div>

			<Table className="m-auto w-1/2" responsive bordered>
				<thead>
					<tr>
						<th>vCPUS</th>
						<th>RAM</th>
						<th>GPU Model</th>
						<th>Number of GPUS</th>
						<th>GPU RAM</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{instance.info.vcpus}</td>
						<td>{instance.info.ram}</td>
						<td>{instance.info.gpu}</td>
						<td>{instance.info.ngpus}</td>
						<td>{instance.vmem}</td>
					</tr>
				</tbody>
			</Table>

			<div>
				<p className="border-px	mb-2 border-b pb-1 text-lg font-semibold">Environmental assessment</p>
				{!carbonData ? (
					<p className="text-center">No carbon data for selected provider</p>
				) : (
					<>
						<Bar
							className="max-h-[500px]"
							ref={chartRef}
							options={{
								locale: 'en-us',
								indexAxis: 'y',
								plugins: {
									legend: {
										display: false
									},
									datalabels: {
										display: false
									},
									tooltip: {
										enabled: false,
										external: ({ tooltip }) => {
											toggleTooltip(tooltip);

											const dataIndex = tooltip.dataPoints[0].dataIndex;
											setRegionData(carbonData[dataIndex]);
										}
									}
								},
								scales: {
									y: {
										grid: {
											display: false
										}
									},
									x: {
										grid: {
											display: false
										},
										title: {
											text: 'CO₂ emissions (kgs)',
											display: true,
											font: {
												size: 14
											}
										}
									}
								}
							}}
							data={{
								labels: carbonData.map(({ regionName }) => regionName),
								datasets: [
									{
										data: carbonData.map(({ carbonEmissions }) => carbonEmissions),
										backgroundColor: '#00a87b'
									}
								]
							}}
						/>

						<GraphTooltip showTooltip={showTooltip}>
							<EnvironmentalAssessmentTooltip regionData={regionData} />
						</GraphTooltip>
					</>
				)}
			</div>
		</div>
	);
};

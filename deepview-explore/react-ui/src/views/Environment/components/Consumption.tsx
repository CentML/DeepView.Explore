import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faGlobeAmericas as Globe, faCar as Car, faHome as Home, faMobileAlt as Phone, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import { getUnitScale } from '@utils/getUnitScale';
import { getEnergyData } from '@utils/getEnergyData';
import LoadingSpinner from '@components/LoadingSpinner';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Consumption = () => {
	const { analysis, epochs, iterations } = useAnalysis();
	const totalIterations = epochs * iterations;

	if (!analysis || !Object.keys(analysis.energy)) {
		return (
			<Card title="Energy consumption">
				<LoadingSpinner />
			</Card>
		);
	}

	const { energy } = analysis;

	if (energy.error) {
		return (
			<Card title="Energy consumption">
				<div className="flex items-center justify-center">
					<Alert variant="danger">
						<Icon icon={faCircleExclamation} size="1x" className="mr-1" />
						There was an error generating consumption analysis
					</Alert>
				</div>
			</Card>
		);
	}

	const { current } = energy;
	const currentCPU = current.components.find((c) => c.type === 'ENERGY_CPU_DRAM');
	const currentGPU = current.components.find((c) => c.type === 'ENERGY_GPU');
	const totalConsumption = getUnitScale(current.total_consumption * totalIterations, 'energy');
	const scalingFactor = 10 ** (totalConsumption.scale_index * 3);
	const cpuScale = currentCPU ? parseFloat(Number((currentCPU.consumption * totalIterations) / scalingFactor).toFixed(2)) : 0;
	const gpuScale = currentGPU ? parseFloat(Number((currentGPU.consumption * totalIterations) / scalingFactor).toFixed(2)) : 0;
	const comparisons = getEnergyData(current.total_consumption * totalIterations);

	return (
		<Card title="Energy consumption">
			<div className="mb-4 flex flex-col items-center gap-4">
				<h2 className="text-xl">
					Total consumption:{' '}
					<strong>
						{totalConsumption.val} {totalConsumption.scale}
					</strong>
				</h2>

				<Pie
					className="max-h-[300px]"
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
								position: 'bottom'
							}
						}
					}}
					data={{
						labels: [`CPU & DRAM Consumption (${totalConsumption.scale})`, `GPU Consumption (${totalConsumption.scale})`],
						datasets: [
							{
								data: [cpuScale, gpuScale],
								backgroundColor: ['#00a87b', '#004331']
							}
						]
					}}
				/>

				<div className="flex flex-col gap-4 sm:flex-row">
					<DataPoint icon={Globe} iconColor="#27ae60" energy={comparisons.carbon} energyUsed="of CO₂ emissions released" />
					<DataPoint icon={Car} iconColor="#3a82b0" energy={comparisons.miles} energyUsed="miles driven " />
					<DataPoint icon={Phone} iconColor="#ff9500" energy={comparisons.phone} energyUsed="smartphones charged" />
					<DataPoint icon={Home} iconColor="#50626d" energy={comparisons.household[0]} energyUsed="homes worth of energy used per minute" />
				</div>
			</div>

			<p className="text-xs">
				Greenhouse gas equivalencies are based on calculations provided by the{' '}
				<a
					className="cursor-pointer text-primary-500 underline"
					href="https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator"
					rel="noreferrer"
					target="_blank"
				>
					EPA
				</a>
				.
			</p>
		</Card>
	);
};

interface DataPointProps {
	energy: string | number;
	energyUsed: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
	iconColor: string;
}

const DataPoint = ({ energy, energyUsed, icon, iconColor }: DataPointProps) => {
	return (
		<div className="flex flex-col items-center gap-2">
			<Icon icon={icon} size="2x" color={iconColor} />
			<p className="text-center">
				<strong>{energy}</strong> {energyUsed}
			</p>
		</div>
	);
};

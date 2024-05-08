import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCar as Car, faHome as Home, faMobileAlt as Phone } from '@fortawesome/free-solid-svg-icons';

export interface RegionData {
	regionName: string;
	carbonEmissions: number;
	miles: string;
	household: (string | number)[];
	phone: string;
}

interface EnvironmentalAssessmentTooltipProps {
	regionData?: RegionData;
}

export const EnvironmentalAssessmentTooltip = ({ regionData }: EnvironmentalAssessmentTooltipProps) => {
	if (!regionData) return null;

	return (
		<>
			<p className="text-2xl font-semibold">{regionData.regionName}</p>
			<p className="text-lg">
				<strong>{regionData.carbonEmissions.toFixed(4)}</strong> kilograms CO₂ released
			</p>

			<p className="mt-2 text-sm">Equivalent to:</p>
			<ul className="ml-2 text-sm">
				<li className="flex items-center gap-1">
					<Icon className="w-5" icon={Car} color="#3a82b0" />
					<p>
						<strong>{regionData.miles}</strong> miles driven
					</p>
				</li>
				<li className="flex items-center gap-1">
					<Icon className="w-5" icon={Phone} color="#ff9500" />
					<p>
						<strong>{regionData.phone}</strong> smartphones charged
					</p>
				</li>
				<li className="flex items-center gap-1">
					<Icon className="w-5" icon={Home} color="#50626d" />
					<p>
						<strong>{regionData.household[0]}</strong> homes worth of energy used per hour
					</p>
				</li>
			</ul>
		</>
	);
};

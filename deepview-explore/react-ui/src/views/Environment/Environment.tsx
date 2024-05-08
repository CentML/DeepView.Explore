import { useAnalysis } from '@context/useAnalysis';
import { TabPanel } from '@layout/Layout';
import { Consumption } from './components/Consumption';
import { RelativeImpact } from './components/RelativeImpact';

const Environment = () => {
	const { analysis } = useAnalysis();

	const noAnalysis = !analysis || Object.keys(analysis).length === 0 || !analysis.energy || Object.keys(analysis.energy).length === 0;

	return (
		<TabPanel name="environmental impact">
			{noAnalysis ? (
				<h2 className="text-center">No Analysis</h2>
			) : (
				<div className="mdplus:grid-cols-2 grid grid-cols-1 gap-4 ">
					<Consumption analysis={analysis} />
					<RelativeImpact analysis={analysis} />
				</div>
			)}
		</TabPanel>
	);
};

export default Environment;

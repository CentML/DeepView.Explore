import { EnvironmentConsumption, EnvironmentImpact } from '@centml/deepview-ui';
import { TabPanel } from '@layout/Layout';
import { useAnalysis } from '@context/useAnalysis';

const Environment = () => {
	const { analysis, epochs, iterations } = useAnalysis();

	return (
		<TabPanel name="environmental impact">
			<div className="grid grid-cols-1 gap-4 mdplus:grid-cols-2 ">
				<EnvironmentConsumption energy={analysis.energy} epochs={epochs} iterations={iterations} />
				<EnvironmentImpact energy={analysis.energy} epochs={epochs} iterations={iterations} />
			</div>
		</TabPanel>
	);
};

export default Environment;

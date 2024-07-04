import { DataParallelTraining, DeploymentTarget, Habitat } from '@centml/deepview-ui';
import { useAnalysis } from '@context/useAnalysis';
import { TabPanel } from '@layout/Layout';

const Deployment = () => {
	const { analysis, epochs, isUsingDdp, iterations } = useAnalysis();

	return (
		<TabPanel name="deployment">
			<div className="flex flex-col gap-4">
				<DeploymentTarget additionalProviders={analysis.additionalProviders} epochs={epochs} habitat={analysis.habitat} iterations={iterations} />

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Habitat habitat={analysis.habitat} />
					<DataParallelTraining breakdown={analysis.breakdown} ddp={analysis.ddp} isUsingDdp={isUsingDdp} />
				</div>
			</div>
		</TabPanel>
	);
};

export default Deployment;

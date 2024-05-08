import { useAnalysis } from '@context/useAnalysis';
import { TabPanel } from '@layout/Layout';
import { DeploymentTarget } from './components/DeploymentTarget';
import { Habitat } from './components/Habitat';
import { DataParallelTraining } from './components/DataParallelTraining';

const Deployment = () => {
	const { analysis, epochs, isUsingDdp, iterations } = useAnalysis();
	const totalIterations = epochs * iterations;

	return (
		<TabPanel name="deployment">
			{!analysis ? (
				<h2 className="text-center">No Analysis</h2>
			) : (
				<div className="flex flex-col gap-4">
					<DeploymentTarget analysis={analysis} totalIterations={totalIterations} />

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<Habitat analysis={analysis} />
						<DataParallelTraining analysis={analysis} isUsingDdp={isUsingDdp} />
					</div>
				</div>
			)}
		</TabPanel>
	);
};

export default Deployment;

import { TabPanel } from '@layout/Layout';
import { DeploymentTarget } from './components/DeploymentTarget';
import { Habitat } from './components/Habitat';
import { DataParallelTraining } from './components/DataParallelTraining';

const Deployment = () => {
	return (
		<TabPanel name="deployment">
			<div className="flex flex-col gap-4">
				<DeploymentTarget />

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<Habitat />
					<DataParallelTraining />
				</div>
			</div>
		</TabPanel>
	);
};

export default Deployment;

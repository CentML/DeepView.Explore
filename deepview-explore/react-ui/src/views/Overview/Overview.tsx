import { TabPanel } from '@layout/Layout';
import { Stats } from './components/Stats';
import { ProjectInfo } from './components/ProjectInfo';
import { Training } from './components/Training';

const Overview = () => {
	return (
		<TabPanel name="overview">
			<div className="flex flex-col gap-4">
				<ProjectInfo />
				<Stats />
				<Training />
			</div>
		</TabPanel>
	);
};

export default Overview;

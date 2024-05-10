import { TabPanel } from '@layout/Layout';
import { Consumption } from './components/Consumption';
import { RelativeImpact } from './components/RelativeImpact';

const Environment = () => {
	return (
		<TabPanel name="environmental impact">
			<div className="grid grid-cols-1 gap-4 mdplus:grid-cols-2 ">
				<Consumption />
				<RelativeImpact />
			</div>
		</TabPanel>
	);
};

export default Environment;

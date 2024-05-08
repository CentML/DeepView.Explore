import Deployment from './Deployment';
import Environment from './Environment';
import Overview from './Overview';
import Profiling from './Profiling';

const Views = () => {
	return (
		<>
			<Overview />
			<Profiling />
			<Deployment />
			<Environment />
		</>
	);
};

export default Views;

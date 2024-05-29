import ErrorView from '@views/Error';
import Welcome from '@views/Welcome';
import Layout from '@layout/Layout';
import Views from '@views/index';
import { useAnalysis } from '@context/useAnalysis';
import LoadingSpinner from '@components/LoadingSpinner';

function App() {
	const { analysis, error, handleConnection, isLoading } = useAnalysis();

	if (error) {
		return <ErrorView error={error} handleConnection={handleConnection} />;
	}

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<LoadingSpinner />
			</div>
		);
	}

	if (!Object.keys(analysis).length || !Object.keys(analysis.breakdown).length || !Object.keys(analysis.throughput).length) {
		return <Welcome />;
	}

	return (
		<Layout>
			<Views />
		</Layout>
	);
}

export default App;

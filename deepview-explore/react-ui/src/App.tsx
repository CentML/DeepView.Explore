import { Spinner } from 'react-bootstrap';
import ErrorView from '@views/Error';
import Welcome from '@views/Welcome';
import Layout from '@layout/Layout';
import Views from '@views/index';
import { useAnalysis } from '@context/useAnalysis';

function App() {
	const { analysis, error, handleConnection, isLoading } = useAnalysis();

	if (error) {
		return <ErrorView error={error} handleConnection={handleConnection} />;
	}

	if (!analysis || !analysis?.throughput || Object.keys(analysis.throughput).length === 0) {
		return <Welcome />;
	}

	if (isLoading)
		return (
			<div className="flex h-screen items-center justify-center text-primary-500">
				<Spinner animation="border" role="status">
					<p className="sr-only">Loading...</p>
				</Spinner>
			</div>
		);

	return (
		<Layout>
			<Views />
		</Layout>
	);
}

export default App;

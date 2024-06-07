import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import LoadingSpinner from '@components/LoadingSpinner';
import Card from '@components/Card';
import { getTrainingTime } from '@utils/getTrainingTime';
import { formatNumber } from '@utils/formatNumber';
import { loadJsonFiles, type CloudProviders, type ParseError as ParseErrorType } from '@utils/parsers';
import { ParseError } from './ParseError';
import { GraphData, TargetScatterGraph } from './TargetScatterGraph';
import { DeploymentPlan, type Instance } from './DeploymentPlan';

export const DeploymentTarget = () => {
	const { analysis, epochs, iterations } = useAnalysis();
	const totalIterations = epochs * iterations;

	const [rawData, setRawData] = useState<Instance[]>([]);
	const [graphData, setGraphData] = useState<GraphData[]>([]);
	const [selectedInstance, setSelectedInstance] = useState<Instance | undefined>(undefined);
	const [isMultipleSelected, setIsMultipleSelected] = useState(false);
	const [cloudProviders, setCloudProviders] = useState<CloudProviders[]>([]);
	const [gpus, setGpus] = useState<string[]>([]);
	const [errors, setErrors] = useState<ParseErrorType[]>([]);

	useEffect(() => {
		async function parseData() {
			const { cloudProviders, instanceArray, errors } = await loadJsonFiles(analysis.habitat.predictions, analysis.additionalProviders);

			if (errors) setErrors(errors);

			setCloudProviders(cloudProviders);

			const gpusUsed = instanceArray.reduce((acc: string[], { info: { gpu } }) => {
				if (!acc.includes(gpu)) return [...acc, gpu];
				return acc;
			}, []);
			setGpus(gpusUsed);

			const parsedGraphData = cloudProviders.reduce((acc: GraphData[], { name, color }) => {
				const data = instanceArray
					.filter(({ info: { provider } }) => provider === name)
					.map(({ id, info, x }) => {
						const time = getTrainingTime(totalIterations, x, info.ngpus);
						const cost = info.cost * time;

						return {
							id,
							x: time,
							y: cost,
							gpu: info.gpu,
							ngpus: info.ngpus
						};
					});

				return [
					...acc,
					{
						label: name,
						data,
						backgroundColor: color
					}
				];
			}, []);

			setGraphData(parsedGraphData);
			setRawData(instanceArray);
		}

		if (Object.keys(analysis.habitat).length) parseData();
	}, [analysis]);

	if (!Object.keys(analysis.habitat).length) {
		return (
			<Card title="Deployment target">
				<LoadingSpinner />
			</Card>
		);
	}

	return (
		<Card title="Deployment target">
			<div className="mb-4 flex flex-col gap-4">
				<h2 className="text-xl">
					Estimation for <strong>{formatNumber(totalIterations)}</strong> total iterations.
				</h2>

				<TargetScatterGraph
					cloudProviders={cloudProviders.map(({ name }) => name)}
					gpus={gpus}
					handleSelection={(selectedId) => {
						if (!selectedId) {
							setSelectedInstance(undefined);
							return;
						}

						if (isMultipleSelected) setIsMultipleSelected(false);

						setSelectedInstance(rawData.find(({ id }) => id === selectedId));
					}}
					data={graphData}
					handleMultipleSelected={() => setIsMultipleSelected(true)}
				/>
			</div>

			{errors.length && <ParseError errors={errors} />}

			<h3 className="border-px	mb-4 border-b pb-1 text-lg font-semibold">Deployment plan</h3>
			{!selectedInstance ? (
				<TargetInstance isMultipleSelected={isMultipleSelected} />
			) : (
				<DeploymentPlan
					closeDeploymentPlan={() => setSelectedInstance(undefined)}
					cloudProviders={cloudProviders}
					instance={selectedInstance}
					totalIterations={totalIterations}
				/>
			)}
		</Card>
	);
};

const TargetInstance = ({ isMultipleSelected }: { isMultipleSelected: boolean }) => {
	if (isMultipleSelected) {
		return (
			<div className="flex items-center justify-center">
				<Alert variant="info">
					<Icon icon={faInfoCircle} size="1x" className="mr-1" />
					Multiple configurations selected. Please narrow your results before selecting.
				</Alert>
			</div>
		);
	}

	return <p className="grow text-center">Select a configuration to view details.</p>;
};

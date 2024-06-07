import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation, faWarning } from '@fortawesome/free-solid-svg-icons';
import { useAnalysis } from '@context/useAnalysis';
import Card from '@components/Card';
import { gpuPropertyList } from '@data/properties';
import GraphTooltip from '@components/GraphTooltip';
import { useGraphTooltip } from '@components/GraphTooltip/GraphTooltip';
import LoadingSpinner from '@components/LoadingSpinner';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);
interface CardData {
	time: number;
	card: string;
	index: number;
	size: number;
}

interface GraphData {
	consumer: CardData[];
	server: CardData[];
	source: CardData[];
}

const NUMBER_OF_COLUMNS = 5;

export const Habitat = () => {
	const { analysis } = useAnalysis();
	const { habitat } = analysis;

	const [graphData, setGraphData] = useState<GraphData>({ consumer: [], server: [], source: [] });
	const [cardInfo, setCardInfo] = useState<CardData | undefined>(undefined);

	const { chartRef, showTooltip, toggleTooltip } = useGraphTooltip();

	useEffect(() => {
		if (!Object.keys(habitat).length || habitat.error || habitat.isDemo) return;

		const sortedPrediction = habitat.predictions.slice().sort((a, b) => a[1] - b[1]);
		const data = sortedPrediction.reduce(
			(acc: GraphData, [card, time], i) => {
				const gpuProperties = gpuPropertyList.find((gpu) => gpu.name.toLowerCase() === card.toLowerCase());

				const cardData = {
					time: parseFloat(time.toFixed(2)),
					card,
					index: (i % NUMBER_OF_COLUMNS) + 0.5,
					size: 100
				};

				if (gpuProperties) {
					if (gpuProperties.type === 'server') {
						return {
							...acc,
							server: [...acc.server, cardData]
						};
					}

					return {
						...acc,
						consumer: [...acc.consumer, cardData]
					};
				}

				return {
					...acc,
					source: [
						...acc.source,
						{
							...cardData,
							card: 'Local GPU'
						}
					]
				};
			},
			{
				consumer: [],
				server: [],
				source: []
			}
		);

		setGraphData(data);
	}, [habitat]);

	if (!Object.keys(habitat).length) {
		return (
			<Card title="DeepView Predict">
				<LoadingSpinner />
			</Card>
		);
	}

	if (habitat.isDemo) {
		return (
			<Card title="DeepView Predict">
				<div className="flex justify-center">
					<Alert variant="warning">
						<Icon icon={faWarning} size="1x" className="mr-1" />
						The local GPU is not supported by DeepView Predict or DeepView Predict is not installed.
					</Alert>
				</div>
			</Card>
		);
	}

	if (habitat.error) {
		return (
			<Card title="DeepView Predict">
				<div className="flex items-center justify-center">
					<Alert variant="danger">
						<Icon icon={faCircleExclamation} size="1x" className="mr-1" />
						There was an error generating DeepView Predictions
					</Alert>
				</div>
			</Card>
		);
	}

	return (
		<Card title="DeepView.Predict">
			<Scatter
				className="min-h-[500px]"
				ref={chartRef}
				options={{
					locale: 'en-us',
					responsive: true,
					maintainAspectRatio: false,
					layout: {
						padding: {
							top: 50
						}
					},
					plugins: {
						legend: {
							labels: {
								font: {
									size: 12
								},
								boxHeight: 10,
								boxWidth: 10
							},
							position: 'bottom',
							align: 'end'
						},
						datalabels: {
							formatter: (_, { dataIndex, dataset: { label } }) => {
								if (label === 'workstation card') return graphData.consumer[dataIndex].card;
								if (label === 'server card') return graphData.server[dataIndex].card;
								if (label === 'local card') return graphData.source[dataIndex].card;
							},
							align: 'top',
							offset: 10,
							labels: {
								title: {
									font: {
										weight: 'bold'
									}
								}
							}
						},
						tooltip: {
							enabled: false,
							external: ({ tooltip }) => {
								toggleTooltip(tooltip);

								const label = tooltip.dataPoints[0].dataset.label;
								const index = tooltip.dataPoints[0].dataIndex;

								if (label === 'workstation card') setCardInfo(graphData.consumer[index]);
								if (label === 'server card') setCardInfo(graphData.server[index]);
								if (label === 'local card') setCardInfo(graphData.source[index]);
							}
						}
					},
					elements: {
						point: {
							radius: 8,
							hitRadius: 8,
							hoverRadius: 10,
							hoverBorderWidth: 1
						}
					},
					scales: {
						y: {
							display: false,
							beginAtZero: true,
							grid: {
								display: false
							}
						},
						x: {
							title: {
								text: 'Predicted runtime (ms)',
								display: true,
								font: {
									size: 14
								}
							},
							grid: {
								display: false
							},
							max: 1.2 * habitat.predictions.reduce((a, b) => Math.max(a, b[1]), -Infinity)
						}
					}
				}}
				data={{
					datasets: [
						{ label: 'workstation card', data: graphData.consumer.map(({ time, index }) => ({ x: time, y: index })), backgroundColor: '#ff6385' },
						{ label: 'server card', data: graphData.server.map(({ time, index }) => ({ x: time, y: index })), backgroundColor: '#35a2eb' },
						{ label: 'local card', data: graphData.source.map(({ time, index }) => ({ x: time, y: index })), backgroundColor: '#9b59b6' }
					]
				}}
			/>

			<GraphTooltip showTooltip={showTooltip}>
				<p className="text-sm font-semibold">{cardInfo?.card}</p>
				<p className="text-sm">Training time: {cardInfo?.time} ms</p>
			</GraphTooltip>
		</Card>
	);
};

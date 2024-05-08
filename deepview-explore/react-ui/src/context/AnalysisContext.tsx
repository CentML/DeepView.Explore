import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { vscode } from '@utils/vscode';
import { profiling_data } from '@mocks/mock_data';
import { GPU_MAX_CAPACITY_LIMIT } from '@data/properties';
import type { ProfilingData, TimeBreakDown } from '@interfaces/ProfileData';
import type { ErrorState } from '@interfaces/ErrorState';
import { getTraceByLevel } from '@utils/getTraceByLevel';
import { computePercentage } from '@utils/computePercentage';
import { getUtilizationData, type UtilizationTableData } from '@utils/getUtilizationData';
import { verifyHabitatData } from '@utils/verifyHabitatData';
import type { Message } from './message.types';

interface TimeBreakDownState {
	coarse: TimeBreakDown[];
	fine: TimeBreakDown[];
}

interface AnalysisContext {
	analysis: ProfilingData | null;
	encodedFiles: unknown;
	epochs: number;
	error: ErrorState | undefined;
	handleConnection: (type: 'connect' | 'restart') => void;
	hasTextChanged: boolean;
	isLoading: boolean;
	iterations: number;
	isUsingDdp: boolean;
	timeBreakDown: TimeBreakDownState | null;
	throughput: number;
	updateDdp: () => void;
	updateTraining: (training: { epochs: number; iterations: number }) => void;
	utilizationData: UtilizationTableData | null;
}

const initialState: AnalysisContext = {
	analysis: null,
	encodedFiles: undefined,
	epochs: 50,
	error: undefined,
	handleConnection: () => undefined,
	hasTextChanged: false,
	isLoading: false,
	isUsingDdp: true,
	iterations: 2000,
	timeBreakDown: null,
	throughput: 0,
	updateDdp: () => undefined,
	updateTraining: () => undefined,
	utilizationData: {} as UtilizationTableData
};

const useMockData = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MOCKS;

export const AnalysisContext = createContext(initialState);

export const AnalysisProvider = ({ children }: PropsWithChildren) => {
	const [analysis, setAnalysis] = useState<ProfilingData | null>(null);
	const [encodedFiles, setEncodedFiles] = useState<unknown | undefined>(undefined);
	const [epochs, setEpochs] = useState(50);
	const [hasTextChanged, setHasTextChanged] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isUsingDdp, setIsUsingDdp] = useState(true);
	const [iterations, setIterations] = useState(2000);
	const [error, setError] = useState<ErrorState | undefined>(undefined);
	const [timeBreakDown, setTimeBreakDown] = useState<TimeBreakDownState | null>(null);
	const [utilizationData, setUtilizationData] = useState<UtilizationTableData | null>(null);

	useEffect(() => {
		setIsLoading(true);

		if (useMockData) {
			updateAnalysis(profiling_data);
			setIsLoading(false);
			return;
		} else {
			vscode.connect();
		}

		function handleMessage({ data }: MessageEvent<Message>) {
			const messageType = data.message_type;
			switch (messageType) {
				case 'connection':
					if (!data.status && !useMockData) setError({ type: 'connection' });
					break;
				case 'analysis':
					updateAnalysis(data as ProfilingData);
					break;
				case 'text_change':
					setHasTextChanged(true);
					break;
				case 'error':
					setError({ type: 'error', message: data.error_text });
					break;
				case 'encoded_files':
					setEncodedFiles(data.fileContents);
					break;
				default:
					console.warn(`Unhandled message type: ${messageType}`);
					break;
			}

			setIsLoading(false);
		}

		window.addEventListener('message', (e: MessageEvent<Message>) => handleMessage(e));

		return () => window.removeEventListener('message', (e: MessageEvent<Message>) => handleMessage(e));
	}, []);

	const handleConnection = (type: 'connect' | 'restart') => {
		if (hasTextChanged) setHasTextChanged(false);
		if (error) setError(undefined);

		if (type === 'connect') {
			setAnalysis(null);
			vscode.connect();
			return;
		}

		vscode.restart();
	};

	const updateAnalysis = (data: ProfilingData) => {
		setAnalysis(verifyHabitatData(data) as ProfilingData);

		setUtilizationData(getUtilizationData(data.utilization.rootNode));

		if (data.breakdown && data.breakdown.operation_tree) {
			const { coarse, fine } = getTraceByLevel(data.breakdown.operation_tree);
			const computeCoarse = computePercentage(coarse, data.breakdown.iteration_run_time_ms);
			const computeFine = computePercentage(fine, data.breakdown.iteration_run_time_ms);

			setTimeBreakDown({ coarse: computeCoarse, fine: computeFine });
		}
	};

	const updateDdp = () => setIsUsingDdp((prev) => !prev);

	const updateTraining = (training: { epochs: number; iterations: number }) => {
		setEpochs(training.epochs);
		setIterations(training.iterations);
	};

	const value = useMemo(
		() => ({
			analysis,
			encodedFiles,
			epochs,
			error,
			handleConnection,
			hasTextChanged,
			isLoading,
			isUsingDdp,
			iterations,
			timeBreakDown,
			throughput: getThroughput(analysis, !useMockData),
			updateDdp,
			updateTraining,
			utilizationData
		}),
		[analysis, encodedFiles, epochs, error, handleConnection, hasTextChanged, isLoading, isUsingDdp, iterations, updateDdp, updateTraining]
	);

	return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

function getThroughput(analysis: ProfilingData | null, useBatchSize = false) {
	if (!analysis) return 0;

	const { throughput, breakdown } = analysis;

	if (!Object.keys(throughput).length || !Object.keys(breakdown).length) return 0;

	const memoryModel = throughput.peak_usage_bytes;
	const throughputModel = throughput.run_time_ms;
	const maxBatch = Math.floor((GPU_MAX_CAPACITY_LIMIT * breakdown.memory_capacity_bytes - memoryModel[1]) / memoryModel[0]);

	let batchSize = 0;
	if (!useBatchSize) {
		batchSize = Math.max(1, Math.min(batchSize, maxBatch));
	}

	return Math.round((batchSize * 1000.0) / (batchSize * throughputModel[0] + throughputModel[1]));
}

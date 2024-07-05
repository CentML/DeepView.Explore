import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { computePercentage, getTraceByLevel, getUtilizationData, getUsageData } from '@centml/deepview-ui';
import type { NodeData, ProfilingData, TimeBreakDown, UsageData } from '@centml/deepview-ui';
import { profiling_data } from '@mocks/mock_data';
import type { ErrorState } from '@interfaces/ErrorState';
import { vscode } from '@utils/vscode';
import { verifyHabitatData } from '@utils/verifyHabitatData';
import type { Message } from './message.types';

export const INITIAL_SLIDER_STATE = [50, 69, 420] as [number, number, number];

interface TimeBreakDownState {
	coarse: TimeBreakDown[];
	fine: TimeBreakDown[];
}
export interface UtilizationTableData {
	allOperations: NodeData;
	hideInsignificant: NodeData;
}

interface AnalysisContext {
	analysis: ProfilingData;
	encodedFiles: unknown;
	epochs: number;
	error: ErrorState | undefined;
	handleConnection: (type: 'connect' | 'restart') => void;
	hasTextChanged: boolean;
	isLoading: boolean;
	iterations: number;
	isUsingDdp: boolean;
	statsUsage: UsageData;
	timeBreakDown: TimeBreakDownState | null;
	updateDdp: () => void;
	updateTraining: (training: { epochs: number; iterations: number }) => void;
	utilizationData: UtilizationTableData | null;
}

const initialAnalysis: ProfilingData = {
	message_type: '',
	hardware_info: {
		gpus: []
	},
	project_root: '',
	project_entry_point: '',
	additionalProviders: '',
	throughput: {},
	breakdown: {},
	habitat: {},
	energy: {},
	utilization: {},
	ddp: {}
};

const initialState: AnalysisContext = {
	analysis: initialAnalysis,
	encodedFiles: undefined,
	epochs: 50,
	error: undefined,
	handleConnection: () => undefined,
	hasTextChanged: false,
	isLoading: false,
	isUsingDdp: true,
	iterations: 2000,
	statsUsage: {
		batchSize: 0,
		memory: INITIAL_SLIDER_STATE,
		throughput: INITIAL_SLIDER_STATE
	},
	timeBreakDown: null,
	updateDdp: () => undefined,
	updateTraining: () => undefined,
	utilizationData: {} as UtilizationTableData
};

const useMockData = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MOCKS;

export const AnalysisContext = createContext(initialState);

export const AnalysisProvider = ({ children }: PropsWithChildren) => {
	const [analysis, setAnalysis] = useState<ProfilingData>(initialAnalysis);
	const [encodedFiles, setEncodedFiles] = useState<unknown | undefined>(undefined);
	const [epochs, setEpochs] = useState(50);
	const [hasTextChanged, setHasTextChanged] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isUsingDdp, setIsUsingDdp] = useState(true);
	const [iterations, setIterations] = useState(2000);
	const [error, setError] = useState<ErrorState | undefined>(undefined);
	const [timeBreakDown, setTimeBreakDown] = useState<TimeBreakDownState | null>(null);
	const [statsUsage, setStatsUsage] = useState<UsageData>({
		batchSize: 0,
		memory: INITIAL_SLIDER_STATE,
		throughput: INITIAL_SLIDER_STATE
	});
	const [utilizationData, setUtilizationData] = useState<UtilizationTableData | null>(null);

	useEffect(() => {
		setIsLoading(true);

		if (useMockData) {
			updateAnalysis(profiling_data as unknown as ProfilingData);
			setStatsUsage(getUsageData(profiling_data as unknown as ProfilingData, 0.5, null, profiling_data.breakdown.batch_size));
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
					setStatsUsage(getUsageData(data as ProfilingData, null, null, (data as ProfilingData).breakdown.batch_size));
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
			setAnalysis(initialAnalysis);
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
			statsUsage,
			timeBreakDown,
			updateDdp,
			updateTraining,
			utilizationData
		}),
		[
			analysis,
			encodedFiles,
			epochs,
			error,
			handleConnection,
			hasTextChanged,
			isLoading,
			isUsingDdp,
			iterations,
			statsUsage,
			timeBreakDown,
			updateDdp,
			updateTraining,
			utilizationData
		]
	);

	return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>;
};

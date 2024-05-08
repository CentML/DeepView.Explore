import { useContext } from 'react';
import { AnalysisContext } from './AnalysisContext';

export const useAnalysis = () => {
	const ctx = useContext(AnalysisContext);

	if (!ctx) throw new Error('Analysis context must be used within an AnalysisProvider');

	return ctx;
};

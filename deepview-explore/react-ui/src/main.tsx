import React from 'react';
import ReactDOM from 'react-dom/client';
import { AnalysisProvider } from '@context/AnalysisContext.tsx';
import App from './App.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<AnalysisProvider>
				<App />
			</AnalysisProvider>
		</ErrorBoundary>
	</React.StrictMode>
);

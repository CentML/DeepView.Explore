import type { WebviewApi } from 'vscode-webview';

// http://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/frameworks/hello-world-react-vite/webview-ui/src/utilities/vscode.ts

/**
 * A utility wrapper around the acquireVsCodeApi() function, which enables
 * message passing and state management between the webview and extension
 * contexts.
 *
 * This utility also enables webview code to be run in a web browser-based
 * dev server by using native web browser features that mock the functionality
 * enabled by acquireVsCodeApi.
 */
class VSCodeAPIWrapper {
	private readonly vsCodeApi: WebviewApi<unknown> | undefined;

	constructor() {
		// Check if the acquireVsCodeApi function exists in the current development
		// context (i.e. VS Code development window or web browser)
		if (typeof acquireVsCodeApi === 'function') {
			this.vsCodeApi = acquireVsCodeApi();
		}
	}

	/**
	 * Post a message (i.e. send arbitrary data) to the owner of the webview.
	 *
	 * @remarks When running webview code inside a web browser, postMessage will instead
	 * log the given message to the console.
	 *
	 * @param message Abitrary data (must be JSON serializable) to send to the extension context.
	 */
	public postMessage(message: unknown) {
		if (this.vsCodeApi) {
			this.vsCodeApi.postMessage(message);
		} else {
			console.log(message);
		}
	}

	/**
	 * Connect to vscode
	 *
	 */
	public connect() {
		if (this.vsCodeApi) {
			this.vsCodeApi.postMessage({ command: 'connect' });
		} else {
			console.log('could not connect');
		}
	}

	/**
	 * Highlight code
	 *
	 */
	public highlightCode(file: string, lineno: number) {
		if (this.vsCodeApi) {
			this.vsCodeApi.postMessage({ command: 'highlight_source_line', file, lineno });
		} else {
			console.log('could not highlight code');
		}
	}

	/**
	 * Restart connection
	 *
	 */
	public restart() {
		if (this.vsCodeApi) {
			this.vsCodeApi.postMessage({ command: 'restart_profiling_clicked' });
		} else {
			console.log('could not restart');
		}
	}

	/**
	 * Start analysis
	 */
	public startAnalysis(isUsingDdp: boolean) {
		if (this.vsCodeApi) {
			this.vsCodeApi.postMessage({ command: 'begin_analysis_clicked', ddpFlag: isUsingDdp });
		} else {
			console.log('could not start analysis');
		}
	}

	/**
	 * Start analysis
	 * @param file_names- string[]
	 */
	public startEncoding(file_names: string[]) {
		if (this.vsCodeApi) {
			this.vsCodeApi.postMessage({ command: 'encoding_start', file_names });
		} else {
			console.log('could not start encoding');
		}
	}
}

// Exports class singleton to prevent multiple invocations of acquireVsCodeApi.
export const vscode = new VSCodeAPIWrapper();

import * as vscode from 'vscode';
import {SkylineEnvironment, SkylineSession, SkylineSessionOptions} from './skyline_session';

import * as path from 'path';
import { AnalyticsManager } from './analytics/AnalyticsManager';

const PRIVACY_STATEMENT_URL = "https://centml.ai/privacy-policy/";
const OPT_OUT_INSTRUCTIONS_URL = "https://github.com/CentML/DeepView.Explore#how-to-disable-telemetry-reporting";
const RETRY_OPTIN_DELAY_IN_MS = 60 * 60 * 1000; // 1h

export function activate(context: vscode.ExtensionContext) {
	let sess: SkylineSession;

	let environ_options: SkylineEnvironment = {
		reactProjectRoot: path.join(context.extensionPath, "react-ui")
	};

	let anayticsManager: AnalyticsManager = new AnalyticsManager();
	const telemetrySender: vscode.TelemetrySender = {
		sendEventData: anayticsManager.sendEventData,
		sendErrorData: anayticsManager.sendErrorData,
		flush: anayticsManager.closeAndFlush
	};
	const logger = vscode.env.createTelemetryLogger(telemetrySender);

	let disposable = vscode.commands.registerCommand('skyline-vscode.cmd_begin_analyze', () => {
			let vsconfig = vscode.workspace.getConfiguration('skyline');

			let options: vscode.OpenDialogOptions = {
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				title: "Skyline"
			};

			vscode.window.showOpenDialog(options).then(uri => {
				if (!uri) {
					vscode.window.showErrorMessage("You must select a valid project root!");
					return;
				};

				const panel = vscode.window.createWebviewPanel(
					'skyline',
					"Skyline",
					vscode.ViewColumn.Beside,
					{
						enableScripts: true,
						localResourceRoots: [
							vscode.Uri.file(path.join(environ_options.reactProjectRoot, 'build'))
						],
						retainContextWhenHidden: true
					}
				);
				console.log("EXTENSION.TS FILE",vsconfig);
				let sess_options: SkylineSessionOptions = {
					context: 		context,
					projectRoot: 	uri[0].fsPath,
					addr: 			vsconfig.address,
					port: 			vsconfig.port,
					providers:		vsconfig.providers,
					isTelemetryEnabled: isTelemetryEnabled,
					webviewPanel: 	panel,
					telemetryLogger: logger
				};



				let startSkyline = function() {
					sess = new SkylineSession(sess_options, environ_options);
					sess.startSkyline = startSkyline;

					vscode.window.onDidChangeActiveTextEditor(editor => {
						console.log("onDidChangeActiveTextEditor");
						if (editor) sess.annotate_editor(editor);
						});
				}

				startSkyline();
				showTelemetryOptInDialogIfNeeded();
			});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {

}

async function showTelemetryOptInDialogIfNeeded() {
	let vsconfig = vscode.workspace.getConfiguration('skyline');
	if (vsconfig.isTelemetryEnabled === "Ask me"){
		// Pop up the message then wait
		const message: string = `Help CentML improve DeepView by allowing us to collect usage data. 
		Read our [privacy statement](${PRIVACY_STATEMENT_URL}) 
		and learn how to [opt out](${OPT_OUT_INSTRUCTIONS_URL}).`;

		const retryOptin = setTimeout(showTelemetryOptInDialogIfNeeded, RETRY_OPTIN_DELAY_IN_MS);
		let selection: string | undefined;
		selection = await vscode.window.showInformationMessage(message, 'Yes', 'No');
		if (!selection) {
		  return;
		}
		clearTimeout(retryOptin);
		vsconfig.update("isTelemetryEnabled", selection, true);
	}
}

function isTelemetryEnabled(): boolean {
	let vsconfig = vscode.workspace.getConfiguration('skyline');
	return (vsconfig.isTelemetryEnabled === "Yes");
}
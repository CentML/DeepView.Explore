import { url } from 'inspector';
import * as vscode from 'vscode';
import {SkylineSession, SkylineSessionOptions} from './skyline_session';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "skyline-vscode" is now active!');

	let sess: SkylineSession;

	let disposable = vscode.commands.registerCommand('skyline-vscode.cmd_begin_analyze', () => {
		if (sess != undefined) {
			vscode.window.showInformationMessage("Sending analysis request.");
			sess.send_analysis_request();
		} else {
			let options: vscode.OpenDialogOptions = {
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false
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
					{}
				);

				let sess_options: SkylineSessionOptions = {
					context: 		context,
					projectRoot: 	uri[0].fsPath,
					addr: 			"localhost",
					port: 			60120,
					webviewPanel: 	panel
				};

				sess = new SkylineSession(sess_options);
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

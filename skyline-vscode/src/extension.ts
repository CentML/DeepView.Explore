import { url } from 'inspector';
import * as vscode from 'vscode';
import {SkylineSession, SkylineSessionOptions} from './skyline_session';

import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "skyline-vscode" is now active!');

	let sess: SkylineSession;
	let skylineProcess: cp.ChildProcess;

	let disposable = vscode.commands.registerCommand('skyline-vscode.cmd_begin_analyze', () => {
		if (sess != undefined) {
			vscode.window.showInformationMessage("Sending analysis request.");
			console.log("sess", sess);
			console.log("skylineProcess", skylineProcess);
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

				// TODO: Unhardcode this later.
				vscode.workspace.openTextDocument(vscode.Uri.file(uri[0].fsPath + "/entry_point.py")).then(doc => {
					vscode.window.showTextDocument(doc);
				});

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

				skylineProcess = cp.spawn(
					"/home/jim/research/skyline/skyline/cli/venv/bin/python",
					["-m", "skyline", "interactive", "--skip-atom", "--debug", "entry_point.py" ],
					{ cwd: uri[0].fsPath }
				);
				skylineProcess.stdout?.on('data', function(data) {
					console.log("stdout:", data.toString());
				});

				skylineProcess.stderr?.on('data', function(data) {
					console.log("stderr:", data.toString());
				});

				skylineProcess.on("close", function() {
					console.log("Process closed");
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

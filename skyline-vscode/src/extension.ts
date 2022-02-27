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
				/* 
				vscode.workspace.openTextDocument(vscode.Uri.file(uri[0].fsPath + "/entry_point.py")).then(doc => {
					vscode.window.showTextDocument(doc);
				});
				*/

				const panel = vscode.window.createWebviewPanel(
					'skyline',
					"Skyline",
					vscode.ViewColumn.Beside,
					{
						enableScripts: true,
						localResourceRoots: [
							vscode.Uri.file("/home/jim/research/skyline-vscode/react-test/build")
						]
					}
				);

				let sess_options: SkylineSessionOptions = {
					context: 		context,
					projectRoot: 	uri[0].fsPath,
					addr: 			"localhost",
					port: 			60120,
					webviewPanel: 	panel
				};

				skylineProcess = cp.spawn(
					// "/home/jim/tmp/skyline/venv/bin/python",
					"/home/jim/research/skyline/skyline/cli/venv39/bin/python",
					["-m", "skyline", "interactive", "--skip-atom", "--debug", "entry_point.py" ],
					{ cwd: uri[0].fsPath }
				);

				skylineProcess.stdout?.on('data', function(data) {
					console.log("stdout:", data.toString());
				});

				skylineProcess.stderr?.on('data', function(data) {
					let stderr = data.toString();
					console.log("stderr", stderr);
					if (stderr.includes("listening for connections")) {
						console.log("Backend ready.");
						sess = new SkylineSession(sess_options);
					}
				});

				skylineProcess.on("close", function() {
					console.log("Process closed");
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {

}

import * as vscode from 'vscode';
import {SkylineEnvironment, SkylineSession, SkylineSessionOptions} from './skyline_session';

import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let sess: SkylineSession;
	let skylineProcess: cp.ChildProcess;

	let environ_options: SkylineEnvironment = {
		binaryPath: "/home/jim/research/port-habitat/venv/bin/skyline",
		// reactProjectRoot: "/home/jim/research/port-habitat/skyline-vscode/react-test"
		reactProjectRoot: path.join(context.extensionPath, "react-ui")
	};

	let disposable = vscode.commands.registerCommand('skyline-vscode.cmd_begin_analyze', () => {
		if (sess != undefined) {
			vscode.window.showInformationMessage("Sending analysis request.");
			console.log("sess", sess);
			console.log("skylineProcess", skylineProcess);
			sess.send_analysis_request();
		} else {
			let vsconfig = vscode.workspace.getConfiguration('skyline');
			if (vsconfig['skyline_bin_location'] != null) {
				environ_options.binaryPath = vsconfig['skyline_bin_location'];
			}

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
					{
						enableScripts: true,
						localResourceRoots: [
							vscode.Uri.file(path.join(environ_options.reactProjectRoot, 'build'))
						],
						retainContextWhenHidden: true
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
					environ_options.binaryPath,
					["interactive", "--skip-atom", "--debug", "entry_point.py"],
					{ cwd: uri[0].fsPath }
				);

				if (vsconfig['write_logs']) {
					var errfile = fs.createWriteStream('/tmp/skyline.log', {flags: 'a'});
					skylineProcess.stderr?.pipe(errfile);
				}

				skylineProcess.stdout?.on('data', function(data) {
					console.log("stdout:", data.toString());
				});

				skylineProcess.stderr?.on('data', function(data) {
					let stderr = data.toString();
					console.log("stderr", stderr);
					if (stderr.includes("listening for connections")) {
						console.log("Backend ready.");
						sess = new SkylineSession(sess_options, environ_options);
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

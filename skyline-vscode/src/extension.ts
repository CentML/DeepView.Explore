import * as vscode from 'vscode';
import {SkylineEnvironment, SkylineSession, SkylineSessionOptions} from './skyline_session';

import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let sess: SkylineSession;
	let skylineProcess: cp.ChildProcess;

	let environ_options: SkylineEnvironment = {
		binaryPath: vscode.workspace.getConfiguration('skyline')['skyline_bin_location'],
		reactProjectRoot: path.join(context.extensionPath, "react-ui")
	};

	let disposable = vscode.commands.registerCommand('skyline-vscode.cmd_begin_analyze', () => {
		if (false && sess != undefined) {
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

				let sess_options: SkylineSessionOptions = {
					context: 		context,
					projectRoot: 	uri[0].fsPath,
					addr: 			"localhost",
					port: 			60120,
					webviewPanel: 	panel
				};

				let on_close = function() {
					console.log(sess.backendShouldRestart);
					if (sess.backendShouldRestart) {
						console.log("Process closed, restarting.");
						startSkyline();
					} else {
						console.log("Process closed, not restarting.");
					}
				};

				let startSkyline = function() {
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
						if (!stderr.includes("Missing kernel metadata entry"))
							console.log("stderr", stderr);
						if (stderr.includes("listening for connections")) {
							console.log("Backend ready.");
							sess = new SkylineSession(sess_options, environ_options);
							sess.skylineProcess = skylineProcess;
							sess.startSkyline = startSkyline;

							vscode.window.onDidChangeActiveTextEditor(editor => {
								console.log("onDidChangeActiveTextEditor");
								if (editor) sess.annotate_editor(editor);
							});
						} else if (stderr.includes("An error occured during analysis")) {
							console.log("Error, reporting to UI!");
							sess.report_error(stderr);
						}
					});

					skylineProcess.on("close", on_close);
				}

				startSkyline();
				// sess.startSkyline = startSkyline;

				skylineProcess.on("close", function() {
				// on_close = function() {
					if (sess.backendShouldRestart) {
						console.log("Process closed, restarting.");
						startSkyline();
					} else {
						console.log("Process closed, not restarting.");
					}
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {

}

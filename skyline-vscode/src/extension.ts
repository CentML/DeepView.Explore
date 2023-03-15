import * as vscode from 'vscode';
import {SkylineEnvironment, SkylineSession, SkylineSessionOptions} from './skyline_session';

import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let sess: SkylineSession;

	let environ_options: SkylineEnvironment = {
		reactProjectRoot: path.join(context.extensionPath, "react-ui")
	};

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

				let sess_options: SkylineSessionOptions = {
					context: 		context,
					projectRoot: 	uri[0].fsPath,
					addr: 			vsconfig.address,
					port: 			vsconfig.port,
					providers:		vsconfig.providers,
					webviewPanel: 	panel
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
			});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {

}


import * as vscode from 'vscode';
import {Socket} from 'net';

import * as pb from './protobuf/innpv_pb';
import * as path from 'path';
import { assert, timeStamp } from 'console';

import { simpleDecoration } from './decorations';
import { settings } from 'cluster';

const nunjucks = require('nunjucks');

export interface SkylineSessionOptions {
    context: vscode.ExtensionContext;
    projectRoot: string;
    addr: string;
    port: number;
    webviewPanel: vscode.WebviewPanel
}

export class SkylineSession {
    // Backend socket connection
    connection: Socket;
    seq_num: number;
    last_length: number;
    message_buffer: Uint8Array;

    // VSCode extension and views
    context: vscode.ExtensionContext;
    webviewPanel: vscode.WebviewPanel;
    openedEditors: Map<string, vscode.TextEditor>

    // Received messages
    msg_initialize?: pb.InitializeResponse;
    msg_throughput?: pb.ThroughputResponse;
    msg_breakdown?: pb.BreakdownResponse;
    msg_habitat?: pb.HabitatResponse;

    root_dir: string;

    constructor(options: SkylineSessionOptions) {
        this.connection = new Socket();
        this.connection.on('data', this.on_data.bind(this));
        this.connection.on('close', this.on_close.bind(this));
        this.connection.connect(options.port, options.addr, this.on_open.bind(this));

        this.seq_num = 0;
        this.last_length = -1;
        this.message_buffer = new Uint8Array();

        this.context = options.context;
        this.webviewPanel = options.webviewPanel;
        this.openedEditors = new Map<string, vscode.TextEditor>();

        this.root_dir = options.projectRoot;
    }

    send_message(message: any, payloadName: string) {
        let msg = new pb.FromClient();
        msg.setSequenceNumber(this.seq_num ++);
        if (payloadName == "Initialize") {
            msg.setInitialize(message);
        } else {
            msg.setAnalysis(message);
        }

        let buf = msg.serializeBinary();
        const lengthBuffer = Buffer.alloc(4);
        lengthBuffer.writeUInt32BE(buf.length, 0);
        this.connection.write(lengthBuffer);
        this.connection.write(buf);
    }

    on_open() {
        // Send skyline initialization request
        console.log("Sending initialization request");
        const message = new pb.InitializeRequest();
        message.setProtocolVersion(5);
        this.send_message(message, "Initialize");
    }

    send_analysis_request() {
        // Send skyline analysis request
        console.log("Sending analysis request");
        const message = new pb.AnalysisRequest();
        message.setMockResponse(false);
        this.send_message(message, "Analysis");
    }

    async on_data(message: Uint8Array) {
        console.log("received data. length ", message.byteLength);

        // Append new message
        // TODO: Make this less inefficient
        let newBuffer = new Uint8Array(this.message_buffer.byteLength + message.byteLength);
        newBuffer.set(this.message_buffer);
        newBuffer.set(message, this.message_buffer.byteLength);
        this.message_buffer = newBuffer;

        while (this.message_buffer.byteLength >= 4) {
            // Read new message length
            if (this.last_length == -1) {
                this.last_length = (this.message_buffer[0] << 24) | 
                                   (this.message_buffer[1] << 16) |
                                   (this.message_buffer[2] << 8) | 
                                   this.message_buffer[3];
                this.message_buffer = this.message_buffer.slice(4);
            }

            // Digest message or quit if buffer not large enough
            if (this.message_buffer.byteLength >= this.last_length) {
                console.log("Handling message of length", this.last_length);
                let body = this.message_buffer.slice(0, this.last_length);
                this.handle_message(body);

                this.message_buffer = this.message_buffer.slice(this.last_length);
                this.last_length = -1;
            }
        }
    }

    async handle_message(message: Uint8Array) {
        try {
            let msg = pb.FromServer.deserializeBinary(message);
            console.log(msg.getPayloadCase());
            switch(msg.getPayloadCase()) {
                case pb.FromServer.PayloadCase.ERROR:
                    break;
                case pb.FromServer.PayloadCase.INITIALIZE:
                    this.msg_initialize = msg.getInitialize();
                    // TODO: Move this to other file.
                    this.webviewPanel.webview.html = await this._getHtmlForWebview();
                    break;
                case pb.FromServer.PayloadCase.ANALYSIS_ERROR:
                    break;
                case pb.FromServer.PayloadCase.THROUGHPUT:
                    this.msg_throughput = msg.getThroughput();
                    break;
                case pb.FromServer.PayloadCase.BREAKDOWN:
                    this.msg_breakdown = msg.getBreakdown();
                    this.highlight_breakdown();
                    break;
                case pb.FromServer.PayloadCase.HABITAT:
                    this.msg_habitat = msg.getHabitat();
                    break;
            };

            // this.webviewPanel.webview.html = await this.rEaCt();
            this.webviewPanel.webview.postMessage(await this.generateStateJson());
        } catch (e) {
            console.log("exception!");
            console.log(message);
            console.log(e);
        }
    }

    highlight_breakdown() {
        if (this.msg_breakdown) {
            let highlights = new Map<string, Array<[number, vscode.MarkdownString]>>();
            for (let node of this.msg_breakdown.getOperationTreeList()) {
                for (let ctx of node.getContextsList()) {
                    let path = ctx.getFilePath()?.getComponentsList().join("/");
                    let lineno = ctx.getLineNumber();
                    let opdata = node.getOperation();

                    if (path) {
                        let lst = highlights.get(path);
                        if (!lst) {
                            lst = new Array<[number, vscode.MarkdownString]>();
                            highlights.set(path, lst);
                        }

                        let label = new vscode.MarkdownString();
                        label.appendMarkdown(`**Forward**: ${opdata!.getForwardMs().toFixed(3)} ms\n\n`);
                        label.appendMarkdown(`**Backward**: ${opdata!.getBackwardMs().toFixed(3)} ms\n\n`);
                        label.appendMarkdown(`**Size**: ${opdata!.getSizeBytes()} bytes\n\n`);
                        lst.push([lineno, label]);
                    }
                }
            }

            for (let path of highlights.keys()) {
                let uri = vscode.Uri.parse(this.root_dir + "/" + path);
                console.log("opening file", uri.toString());
                vscode.workspace.openTextDocument(uri).then(document => {
                    vscode.window.showTextDocument(document, vscode.ViewColumn.Beside).then(editor => {
                    // vscode.window.showTextDocument(document, vscode.ViewColumn.One).then(editor => {
                        let decorations = [];
                        for (let marker of highlights.get(path)!) {
                            let range = new vscode.Range(
                                new vscode.Position(marker[0]-1, 0),
                                new vscode.Position(marker[0]-1, 
                                    document.lineAt(marker[0]-1).text.length)
                            );
                            decorations.push({
                                range: range,
                                hoverMessage: marker[1]
                            });
                        }
                        editor.setDecorations(simpleDecoration, decorations);
                    });
                });
            }
        }
    }

    on_close() {
        console.log("Socket Closed!");
    }

    private _getHtmlForWebview() {
        const buildPath = "/home/ybgao/home/habitat_demo/skyline-vscode/react-test";

		const manifest = require(path.join(buildPath, 'build', 'asset-manifest.json'));
		const mainScript = manifest['files']['main.js'];
		const mainStyle = manifest['files']['main.css'];

		const scriptPathOnDisk = vscode.Uri.file(path.join(buildPath, 'build', mainScript));
		const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
		const stylePathOnDisk = vscode.Uri.file(path.join(buildPath, 'build', mainStyle));
		const styleUri = stylePathOnDisk.with({ scheme: 'vscode-resource' });

		// Use a nonce to whitelist which scripts can be run
		const nonce = 'nonce';

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>Skyline</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src vscode-resource: https:; script-src 'nonce-${nonce}';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(path.join(buildPath, 'build')).with({ scheme: 'vscode-resource' })}/">
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

    async generateStateJson() {
        let fields = {
            "project_root": this.msg_initialize?.getServerProjectRoot()?.toString(),
            "project_entry_point": this.msg_initialize?.getEntryPoint()?.toString(),

            "throughput": {},
            "breakdown": {},

            "habitat": [] as Array<[string, number]>
        };

        if (this.msg_throughput) {
            fields['throughput'] = {
                "samples_per_second": this.msg_throughput?.getSamplesPerSecond(),
                "predicted_max_samples_per_second": this.msg_throughput?.getPredictedMaxSamplesPerSecond(),
                "run_time_ms": [ 
                    this.msg_throughput?.getRunTimeMs()?.getSlope(),
                    this.msg_throughput?.getRunTimeMs()?.getBias()
                ],
                "peak_usage_bytes": [ 
                    this.msg_throughput?.getPeakUsageBytes()?.getSlope(),
                    this.msg_throughput?.getPeakUsageBytes()?.getBias()
                ],
                "batch_size_context": this.msg_throughput?.getBatchSizeContext()?.toString(),
                "can_manipulate_batch_size": this.msg_throughput?.getCanManipulateBatchSize()
            };
        }

        if (this.msg_breakdown) {
            fields['breakdown'] = {
                "peak_usage_bytes": this.msg_breakdown.getPeakUsageBytes(),
                "memory_capacity_bytes": this.msg_breakdown.getMemoryCapacityBytes(),
                "iteration_run_time_ms": this.msg_breakdown.getIterationRunTimeMs(),
                "batch_size": this.msg_breakdown.getBatchSize(),
                "num_nodes_operation_tree": this.msg_breakdown.getOperationTreeList().length,
                "num_nodes_weight_tree": this.msg_breakdown.getWeightTreeList().length
            };
        }

        if (this.msg_habitat) {
            for (let prediction of this.msg_habitat.getPredictionsList()) {
                fields['habitat'].push([ prediction.getDeviceName(), prediction.getRuntimeMs() ]);
            }
        }

        return fields;
    }

    async rEaCt() {
        const filePath: vscode.Uri = vscode.Uri.file(path.join(this.context.extensionPath, 'src', 'html', 'template.html'));
        let htmlBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath.fsPath));
        let html = Buffer.from(htmlBytes).toString('utf-8');

        let fields = {
            "project_root": this.msg_initialize?.getServerProjectRoot()?.toString(),
            "project_entry_point": this.msg_initialize?.getEntryPoint()?.toString(),

            "throughput": {},
            "breakdown": {},

            "habitat": [] as Array<[string, number]>
        };

        if (this.msg_throughput) {
            fields['throughput'] = {
                "samples_per_second": this.msg_throughput?.getSamplesPerSecond(),
                "predicted_max_samples_per_second": this.msg_throughput?.getPredictedMaxSamplesPerSecond(),
                "run_time_ms": [ 
                    this.msg_throughput?.getRunTimeMs()?.getSlope(),
                    this.msg_throughput?.getRunTimeMs()?.getBias()
                ],
                "peak_usage_bytes": [ 
                    this.msg_throughput?.getPeakUsageBytes()?.getSlope(),
                    this.msg_throughput?.getPeakUsageBytes()?.getBias()
                ],
                "batch_size_context": this.msg_throughput?.getBatchSizeContext()?.toString(),
                "can_manipulate_batch_size": this.msg_throughput?.getCanManipulateBatchSize()
            };
        }

        if (this.msg_breakdown) {
            fields['breakdown'] = {
                "peak_usage_bytes": this.msg_breakdown.getPeakUsageBytes(),
                "memory_capacity_bytes": this.msg_breakdown.getMemoryCapacityBytes(),
                "iteration_run_time_ms": this.msg_breakdown.getIterationRunTimeMs(),
                "batch_size": this.msg_breakdown.getBatchSize(),
                "num_nodes_operation_tree": this.msg_breakdown.getOperationTreeList().length,
                "num_nodes_weight_tree": this.msg_breakdown.getWeightTreeList().length
            };
        }

        if (this.msg_habitat) {
            for (let prediction of this.msg_habitat.getPredictionsList()) {
                fields['habitat'].push([ prediction.getDeviceName(), prediction.getRuntimeMs() ]);
            }
        }

        nunjucks.configure({ autoescape: true });

        var rendered = nunjucks.renderString(html, fields);
        return rendered;
    }
}
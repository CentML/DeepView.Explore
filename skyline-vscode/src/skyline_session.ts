
import * as vscode from 'vscode';
import {Socket} from 'net';

import * as pb from './protobuf/innpv_pb';
import * as path from 'path';
import * as fs from 'fs/promises';

export interface SkylineSessionOptions {
    context: vscode.ExtensionContext;
    projectRoot: string;
    addr: string;
    port: number;
    webviewPanel: vscode.WebviewPanel
}

export class SkylineSession {
    connection: Socket;
    seq_num: number;
    context: vscode.ExtensionContext;
    webviewPanel: vscode.WebviewPanel;

    msg_initialize?: pb.InitializeResponse;

    constructor(options: SkylineSessionOptions) {
        this.connection = new Socket();
        this.connection.on('data', this.on_data.bind(this));
        this.connection.on('close', this.on_close.bind(this));
        this.connection.connect(options.port, options.addr, this.on_open.bind(this));

        this.seq_num = 0;
        this.context = options.context;
        this.webviewPanel = options.webviewPanel;
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
        let msg = pb.FromServer.deserializeBinary(message);
        console.log(msg.getPayloadCase());
        switch(msg.getPayloadCase()) {
            case pb.FromServer.PayloadCase.ERROR:
                break;
            case pb.FromServer.PayloadCase.INITIALIZE:
                console.log("Initialize");
                console.log(msg.getInitialize()?.getEntryPoint()?.toString());
                console.log(msg.getInitialize()?.getServerProjectRoot()?.toString());

                this.msg_initialize = msg.getInitialize();
                break;
            case pb.FromServer.PayloadCase.ANALYSIS_ERROR:
                break;
            case pb.FromServer.PayloadCase.THROUGHPUT:
                break;
            case pb.FromServer.PayloadCase.BREAKDOWN:
                break;
            case pb.FromServer.PayloadCase.HABITAT:
                break;
        };

        this.webviewPanel.webview.html = await this.rEaCt();
    }

    on_close() {

    }

    async rEaCt() {
        const filePath: vscode.Uri = vscode.Uri.file(path.join(this.context.extensionPath, 'src', 'html', 'template.html'));
        let htmlBytes = await vscode.workspace.fs.readFile(vscode.Uri.file(filePath.fsPath));
        let html = Buffer.from(htmlBytes).toString('utf-8');

        // TODO: Do properly
        let lookup = {
            "${PROJECT_ROOT}": this.msg_initialize?.getServerProjectRoot()?.toString(),
            "${ENTRY_POINT}": this.msg_initialize?.getEntryPoint()?.toString(),
        };

        for (const [key, value] of Object.entries(lookup)) {
            html = html.replace(key, value as string);
        }

        return html;
    }
}
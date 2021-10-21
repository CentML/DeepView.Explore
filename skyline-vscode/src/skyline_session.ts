
import * as vscode from 'vscode';
import {Socket} from 'net';

import * as pb from './protobuf/innpv_pb';
import * as path from 'path';
import { timeStamp } from 'console';

const nunjucks = require('nunjucks');

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
    msg_throughput?: pb.ThroughputResponse;
    msg_breakdown?: pb.BreakdownResponse;
    msg_habitat?: pb.HabitatResponse;

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
        console.log("received data.");
        let msg = pb.FromServer.deserializeBinary(message);
        console.log(msg.getPayloadCase());
        switch(msg.getPayloadCase()) {
            case pb.FromServer.PayloadCase.ERROR:
                break;
            case pb.FromServer.PayloadCase.INITIALIZE:
                this.msg_initialize = msg.getInitialize();
                break;
            case pb.FromServer.PayloadCase.ANALYSIS_ERROR:
                break;
            case pb.FromServer.PayloadCase.THROUGHPUT:
                this.msg_throughput = msg.getThroughput();
                break;
            case pb.FromServer.PayloadCase.BREAKDOWN:
                this.msg_breakdown = msg.getBreakdown();
                break;
            case pb.FromServer.PayloadCase.HABITAT:
                this.msg_habitat = msg.getHabitat();
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
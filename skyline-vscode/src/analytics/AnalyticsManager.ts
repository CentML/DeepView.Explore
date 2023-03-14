import { isTelemetryEnabled } from "./settings";
import { SegmentInitializer } from "./SegmentInitializer";
import Analytics, { TrackParams } from "@segment/analytics-node";
import { getUserProperties, UserProperties } from "./Properties";
import * as pb from "../protobuf/innpv_pb"

export class AnalyticsManager {
    // initialize
    analytics: Analytics;
    properties: UserProperties;
    constructor() {
        this.analytics = SegmentInitializer.initialize();
        this.properties = getUserProperties();
        this.analytics.identify({userId: this.properties.machineId});
    }
    // handle sending events
    handleEvents(msg: pb.FromServer) {
        if (isTelemetryEnabled())
        {
            this.analytics.track(this.convertMsgToTrackParams(msg));
        }
    }

    convertMsgToTrackParams(msg: pb.FromServer): TrackParams {
        switch(msg.getPayloadCase()) {
            case pb.FromServer.PayloadCase.INITIALIZE:
                return {
                    userId: this.properties.machineId,
                    event: "INITIALIZE",
                    timestamp: new Date(),
                    properties: msg.getInitialize()?.toObject()
                };
            case pb.FromServer.PayloadCase.ANALYSIS_ERROR:
                return {
                    userId: this.properties.machineId,
                    event: "ANALYSIS_ERROR",
                    timestamp: new Date(),
                    properties: msg.getAnalysisError()?.toObject()
                };
            case pb.FromServer.PayloadCase.THROUGHPUT:
                return {
                    userId: this.properties.machineId,
                    event: "THROUGHPUT",
                    timestamp: new Date(),
                    properties: msg.getThroughput()?.toObject()
                };
            case pb.FromServer.PayloadCase.BREAKDOWN:
                return {
                    userId: this.properties.machineId,
                    event : "BREAKDOWN",
                    timestamp: new Date(),
                    properties : msg.getBreakdown()?.toObject()
                };
            case pb.FromServer.PayloadCase.HABITAT:
                return {
                    userId: this.properties.machineId,
                    event : "HABITAT",
                    timestamp: new Date(),
                    properties : msg.getHabitat()?.toObject()
                };
            case pb.FromServer.PayloadCase.ENERGY:
                return {
                    userId: this.properties.machineId,
                    event: "ENERGY",
                    timestamp: new Date(),
                    properties: msg.getEnergy()?.toObject()
                };
            default:
            case pb.FromServer.PayloadCase.ERROR:
                return {
                    userId: this.properties.machineId,
                    event : "ERROR",
                    timestamp: new Date(),
                    properties : msg.getError()?.toObject()
                };
        };
        
    }
}
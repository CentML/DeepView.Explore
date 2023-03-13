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
        let track_params: TrackParams = {
            userId: this.properties.machineId,
            event: String(),
            timestamp: new Date()
        };
        switch(msg.getPayloadCase()) {
            case pb.FromServer.PayloadCase.ERROR:
                track_params.event = "ERROR";
                track_params.properties = msg.getError()?.toObject()
            case pb.FromServer.PayloadCase.INITIALIZE:
                track_params.event = "INITIALIZE";
                track_params.properties = msg.getInitialize()?.toObject();
            case pb.FromServer.PayloadCase.ANALYSIS_ERROR:
                track_params.event = "ANALYSIS_ERROR";
                track_params.properties = msg.getAnalysisError()?.toObject()
            case pb.FromServer.PayloadCase.THROUGHPUT:
                track_params.event = "THROUGHPUT";
                track_params.properties = msg.getThroughput()?.toObject()
            case pb.FromServer.PayloadCase.BREAKDOWN:
                track_params.event = "BREAKDOWN";
                track_params.properties = msg.getBreakdown()?.toObject()
            case pb.FromServer.PayloadCase.HABITAT:
                track_params.event = "HABITAT";
                track_params.properties = msg.getHabitat()?.toObject()
            case pb.FromServer.PayloadCase.ENERGY:
                track_params.event = "ENERGY";
                track_params.properties = msg.getEnergy()?.toObject()
        };
        return track_params;
    }
}
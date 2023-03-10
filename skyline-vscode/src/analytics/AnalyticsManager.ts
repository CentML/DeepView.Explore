import { isTelemetryEnabled } from "./settings";
import { SegmentInitializer } from "./SegmentInitializer";
import Analytics from "@segment/analytics-node";
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
            // case switch based on the message
            // this.analytics.track({userId: this.properties.machineId})
        }
    }
}
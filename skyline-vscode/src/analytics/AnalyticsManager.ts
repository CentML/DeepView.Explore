import { SegmentInitializer } from "./SegmentInitializer";
import Analytics from "@segment/analytics-node";
import { filterObjectByKeyName } from "../utils";
export class AnalyticsManager {

    analytics: Analytics;
    hasIdentifiedUser: boolean;
    userId: string;

    constructor() {
        this.analytics = SegmentInitializer.initialize();
        this.hasIdentifiedUser = false;
        this.userId = String();
    }

    sendEventData = (eventName: string, data?: Record<string, any>) => {
        this.identifyUser(data);
        this.analytics.track({
            userId: this.userId,
            event: eventName,
            timestamp: new Date(),
            properties: data
        });
    };

    sendErrorData = (error: Error, data?: Record<string, any>) => {
        this.identifyUser(data);
        this.analytics.track({
            userId: this.userId,
            event: "Client Error",
            timestamp: new Date(),
            properties: {... data, ...error}
        });
    };
    
    closeAndFlush = () => {
        this.analytics.closeAndFlush();
    };

    identifyUser(data?: Record<string, any>) {
        console.log(data);
        if (!this.hasIdentifiedUser && data) {
            this.userId = data["common.vscodemachineid"];
            const commonTraits = filterObjectByKeyName(data, "common.");
            this.analytics.identify({userId: this.userId, traits:commonTraits });
            this.hasIdentifiedUser = true;
        }
    }
}

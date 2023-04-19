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
        /// #if DEBUG
        console.log("Event!");
        console.log({
            userId: this.userId,
            event: eventName,
            timestamp: new Date(),
            properties: data
        });
        /// #else
        this.analytics.track({
            userId: this.userId,
            event: eventName,
            timestamp: new Date(),
            properties: data
        });
        /// #endif
    };

    sendErrorData = (error: Error, data?: Record<string, any>) => {
        this.identifyUser(data);
        /// #if DEBUG
        console.log("Error!");
        console.log({
            userId: this.userId,
            event: "Client Error",
            timestamp: new Date(),
            properties: {... data, ...error}
        });
        /// #else
        this.analytics.track({
            userId: this.userId,
            event: "Client Error",
            timestamp: new Date(),
            properties: {... data, ...error}
        });
        /// #endif
    };
    
    closeAndFlush = () => {
        this.analytics.closeAndFlush();
    };

    identifyUser(data?: Record<string, any>) {
        if (!this.hasIdentifiedUser && data) {
            this.userId = data["common.vscodemachineid"];
            const commonTraits = filterObjectByKeyName(data, "common.");
            this.hasIdentifiedUser = true;
            /// #if DEBUG
            console.log("Identifying!");
            console.log({ userId: this.userId, traits:commonTraits });
            /// #else
            this.analytics.identify({ userId: this.userId, traits:commonTraits });
            /// #endif
    }
    }
}

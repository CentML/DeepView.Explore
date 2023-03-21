import { Analytics, AnalyticsSettings } from '@segment/analytics-node'


export namespace SegmentInitializer {  
  export function initialize(): Analytics {
    // TODO: make sure the key is inside package.json and validate it
    let analyticsSettings: AnalyticsSettings = {writeKey: 'sOQXQfqVkpJxVqKbL0tbwkO6SFnpm5Ef', maxEventsInBatch: 10, flushInterval: 10000}
    let analytics: Analytics = new Analytics(analyticsSettings);
    return analytics;
  }
}
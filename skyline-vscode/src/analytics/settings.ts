import { env, workspace } from 'vscode';

// Does this need to be updated on event: onDidChangeTelemetryEnabled()
export function isTelemetryEnabled(): boolean {
    return env.isTelemetryEnabled && workspace.getConfiguration('skyline').isTelemetryEnabled;
}

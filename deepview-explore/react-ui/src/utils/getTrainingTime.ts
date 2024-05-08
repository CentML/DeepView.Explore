/**
 *
 * @param totalIterations total number of iterations epoch * iterations
 * @param x time for 1 iteration in ms
 * @param numberOfGpus number of gpus used
 * @returns training time in hours
 */
export function getTrainingTime(totalIterations: number, x: number, numberOfGpus: number) {
	// 3.6e6 to convert total training time from msec to hours, divided by the total number of GPUS
	return (totalIterations * x) / 3.6e6 / numberOfGpus;
}

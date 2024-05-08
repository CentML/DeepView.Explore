import { test, expect, vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import { loadJsonFiles } from './parsers';

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const habitatData = [
	['source', 22.029312],
	['P100', 14.069682],
	['P4000', 127.268085], // 27.268085
	['RTX2070', 16.088268],
	['RTX2080Ti', 11.826558],
	['T4', 22.029312],
	['V100', 10.182922],
	['A100', 10.068596],
	['RTX3090', 9.841998],
	['A40', 11.558072],
	['A4000', 14.67059],
	['RTX4000', 20.2342]
];

const correctDataWithoutOptionals = [
	{
		name: 'gcp',
		logo: 'resources/google.png',
		color: '#ea4335',
		instances: [
			{
				name: 'a2-highgpu-1g',
				gpu: 'a100',
				vcpus: 12,
				ram: 85,
				ngpus: 1,
				cost: 3.67
			}
		]
	},
	{
		name: 'aws',
		logo: 'resources/aws.png',
		color: '#ff9900',
		instances: [
			{
				name: 'p3.2xlarge',
				gpu: 'v100',
				vcpus: 8,
				ram: 61,
				ngpus: 1,
				cost: 3.06
			}
		]
	}
];

const correctDataWithOptionals = [
	{
		name: 'gcp',
		logo: 'resources/google.png',
		color: '#ea4335',
		pue: 1.1,
		regions: {
			'us-central1': {
				emissionsFactor: 0.00003178
			}
		},
		instances: [
			{
				name: 'a2-highgpu-1g',
				gpu: 'a100',
				vcpus: 12,
				ram: 85,
				ngpus: 1,
				cost: 3.67,
				regions: ['us-central1']
			}
		]
	},
	{
		name: 'aws',
		logo: 'resources/aws.png',
		color: '#ff9900',
		pue: 1.15,
		regions: {
			'us-east-1': {
				emissionsFactor: 0.000379069
			}
		},
		instances: [
			{
				name: 'p3.2xlarge',
				gpu: 'v100',
				vcpus: 8,
				ram: 61,
				ngpus: 1,
				cost: 3.06,
				regions: ['us-east-1']
			}
		]
	}
];

const incorrectData = [
	{
		name: 'gcp',
		logo: 'resources/google.png',
		color: '#ea4335',
		instances: [
			{
				name: 'a2-highgpu-1g',
				gpu: 'a100',
				ngpus: 1,
				cost: 3.67
			}
		]
	},
	{
		name: 'aws',
		logo: 'resources/aws.png',
		instances: [
			{
				name: 'p3.2xlarge',
				gpu: 'rtx3050',
				ngpus: 0,
				cost: -3.06
			}
		]
	}
];

test('Validate JSON file without optional values against the schema', async () => {
	vi.spyOn(global, 'fetch').mockResolvedValue({
		ok: true,
		json: vi.fn().mockResolvedValue(correctDataWithoutOptionals)
	} as unknown as Response);
	const resp = await loadJsonFiles(habitatData, '');
	expect(resp).toBeDefined();
	expect(resp.errors).toBeNull();
});

test('Validate JSON file with optional parameters against the schema', async () => {
	vi.spyOn(global, 'fetch').mockResolvedValue({
		ok: true,
		json: vi.fn().mockResolvedValue(correctDataWithOptionals)
	} as unknown as Response);
	const resp = await loadJsonFiles(habitatData, '');
	expect(resp).toBeDefined();
	expect(resp.errors).toBeNull();
});

test('JSON file (URL) is not in the correct format', async () => {
	vi.spyOn(global, 'fetch').mockResolvedValue({
		ok: true,
		json: vi.fn().mockResolvedValue(incorrectData)
	} as unknown as Response);
	const resp = await loadJsonFiles(habitatData, '');
	expect(resp).toBeDefined();
	expect(resp.cloudProviders).toStrictEqual([]);
	expect(resp.instanceArray).toStrictEqual([]);
	expect(resp.errors[0].msg).toMatch(/invalid data format from url/);
});

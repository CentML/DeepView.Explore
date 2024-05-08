import Ajv from 'ajv';
import { gpuPropertyList, CENTML_CLOUD_PROVIDERS_URL, deploymentScatterGraphColorSize } from '@data/properties';
import { cloudProviderSchema } from '@schema/CloudProvidersSchema';
import { getInvalidUrlError } from './getInvalidUrlError';

const ajv = new Ajv({ allErrors: true }); // to report all validation errors (rather than failing on the first errors)
const validate = ajv.compile(cloudProviderSchema);

export interface CloudProviders {
	name: string;
	logo: string;
	color: string;
	regions: {
		[key: string]: {
			emissionFactor: number;
		};
	};
	pue: number;
}

export interface ParseError {
	msg: string;
	code?: string;
	invalidFields?: {
		field: string;
		err: string | undefined;
	}[];
}

export const loadJsonFiles = async (habitatData: unknown, cloudProviderURLs: string = '') => {
	let instanceId = 0;
	const instanceArray = [];
	const cloudProviders: CloudProviders[] = [];
	const errors: ParseError[] = [];

	let urlList = [CENTML_CLOUD_PROVIDERS_URL];
	const additionalList = cloudProviderURLs ? cloudProviderURLs.split(',') : [];
	urlList = urlList.concat(additionalList);
	const listOfPromises = urlList.map((url) => fetch(url, { cache: 'no-store' }));
	const responses = await Promise.all(listOfPromises);

	for (const resp of responses) {
		if (resp.ok) {
			try {
				const res = await resp.json();
				const valid = validate(res);

				if (valid) {
					for (const cloudProvider of res) {
						cloudProviders.push({
							name: cloudProvider.name,
							logo: cloudProvider.logo,
							color: cloudProvider.color,
							regions: cloudProvider.regions,
							pue: cloudProvider.pue
						});

						for (const instanceData of cloudProvider.instances) {
							const found_in_habitat = habitatData.find((item) => item[0].toLowerCase() === instanceData.gpu.toLowerCase());
							const found_in_gpuPropertyList = gpuPropertyList.find((item) => item.name.toLocaleLowerCase() === instanceData.gpu.toLocaleLowerCase());

							instanceArray.push({
								id: instanceId,
								x: found_in_habitat[1], // msec
								y: (instanceData.cost / 3.6e6) * found_in_habitat[1], // cost per msec * habitatData = cost per 1 iteration
								info: {
									instance: instanceData.name.toLocaleLowerCase(),
									gpu: instanceData.gpu.toLocaleLowerCase(),
									vcpus: instanceData.vcpus,
									ram: instanceData.ram,
									ngpus: instanceData.ngpus,
									cost: instanceData.cost,
									provider: cloudProvider.name
								},
								regions: instanceData.regions,
								vmem: found_in_gpuPropertyList?.vmem,
								fill: cloudProvider.color,
								z: deploymentScatterGraphColorSize.NORMALSIZE
							});

							instanceId += 1;
						}
					}
				} else {
					errors.push({
						msg: `invalid data format from url: ${resp.url}`,
						invalidFields: validate?.errors?.map((err) => ({
							field: err.instancePath,
							err: err.message
						}))
					});
				}
			} catch (error) {
				errors.push(getInvalidUrlError('noJsonResponseFromUrl', resp));
			}
		} else {
			errors.push(getInvalidUrlError('invalidUrl', resp));
		}
	}

	return {
		cloudProviders,
		instanceArray,
		errors: errors.length ? errors : null
	};
};

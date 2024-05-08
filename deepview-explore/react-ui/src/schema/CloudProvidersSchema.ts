export const cloudProviderSchema = {
	title: 'CLOUD PROVIDERS SCHEMA DEFINITION',
	description: 'List of cloud providers. Note that there needs to be at least 1 cloud provider ',
	type: 'array',
	items: {
		type: 'object',
		description: 'Properties related to the cloud provider.',
		required: ['name', 'logo', 'color', 'instances'],
		properties: {
			name: {
				type: 'string',
				description: 'name of cloud provider. eg: gcp, aws, azure, coreweave'
			},
			logo: {
				type: 'string',
				description: 'url reference to the logo'
			},
			color: {
				type: 'string',
				description: 'color (CSS format)'
			},
			pue: {
				type: 'number',
				description:
					'Power usage effectiveness is a constant factor on how efficiently the cloud provider uses power. The number should never be less than 1.',
				minimum: 1
			},
			regions: {
				type: 'object',
				description: "Contains the cloud provider's different regions and any properties of the given region",
				properties: {
					emissionFactor: {
						type: 'number',
						description: 'The amount of metric tons of CO2 emitted using this region per KWh (metric ton/kWh)'
					}
				}
			},
			instances: {
				type: 'array',
				description: 'list of instances. Note that there needs to be at least 1 instance',
				items: {
					type: 'object',
					required: ['name', 'gpu', 'vcpus', 'ram', 'ngpus', 'cost'],
					properties: {
						name: { type: 'string', description: 'name of the instance' },
						gpu: {
							enum: ['p100', 'p4000', 'rtx2070', 'rtx2080ti', 't4', 'v100', 'a100', 'rtx3090', 'a40', 'a4000', 'rtx4000'],
							description: 'GPU type. Note this GPU must be supported by DeepView.Predict'
						},
						vcpus: {
							type: 'integer',
							minimum: 1,
							description: 'number of virtual CPUs'
						},
						ram: {
							type: 'integer',
							minimum: 1,
							description: 'DRAM capacity'
						},
						ngpus: {
							type: 'integer',
							minimum: 1,
							description: 'number of gpus in the instance'
						},
						cost: {
							type: 'number',
							exclusiveMinimum: 0,
							description: 'cost per hour'
						},
						regions: {
							type: 'array',
							items: {
								type: 'string',
								description: 'Region name. Note that the name should correspond to a region name in the cloud provider.'
							},
							minItems: 1,
							description: 'List of regions that can run the given instance.'
						}
					}
				},
				minItems: 1
			}
		}
	},
	minItems: 1
};

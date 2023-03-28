export const cloudProviderSchema = {
  title: "SCHEMA DEFINITION FOR CLOUD PROVIDERS",
  description:
    "list of cloud providers, (there needs to be at least 1 cloud provider)",
  type: "array",
  items: {
    type: "object",
    description:
      "each cloud provider needs to include it's name, logo, color, and instance specifications",
    required: ["name", "logo", "color", "instances"],
    properties: {
      name: {
        type: "string",
        description: "name of cloud provider. eg: gcp,aws,azure,coreweaver",
      },
      logo: { type: "string", description: "url reference to the logo" },
      color: { type: "string", description: "color (CSS format)" },
      instances: {
        type: "array",
        description:
          "list of instances (there needs to be at least 1 instance)",
        items: {
          type: "object",
          required: ["name", "gpu", "ngpus", "cost"],
          properties: {
            name: { type: "string", description: "name of the instance" },
            gpu: {
              enum: [
                "p100",
                "p4000",
                "rtx2070",
                "rtx2080ti",
                "t4",
                "v100",
                "a100",
                "rtx3090",
                "a40",
                "a4000",
                "rtx4000",
              ],
              description:
                "only GPUs supported by our product DeepView.Predict",
            },
            ngpus: {
              type: "integer",
              minimum: 1,
              description: "number of gpus in the instance",
            },
            cost: {
              type: "number",
              exclusiveMinimum: 0,
              description: "cost per hour",
            },
          },
          
        },
        minItems: 1,
      },
    },
  },
  minItems: 1,
};

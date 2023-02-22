/**
 * GPU Instances
 * costs are 1 GPU * hr
 * For Google we need to add the cost for the instance itself, a100 run on specific A2 Series
 * while t4, p4, v100, and p100 run on General purposes N1 Series
 * 
 * References:
 * FOR AWS:
 * https://aws.amazon.com/ec2/instance-types/
 * https://aws.amazon.com/ec2/pricing/on-demand/
 * 
 * FOR GOOGLE:
 * https://cloud.google.com/compute/gpus-pricing
 * https://cloud.google.com/products/calculator/
 * 
 * FOR AZURE:
 * https://learn.microsoft.com/en-us/azure/virtual-machines/sizes-gpu
 * https://azure.microsoft.com/en-ca/pricing/details/virtual-machines/windows/#pricing
 * 
 */
export const cloudInstances = [
  {
    id: 0,
    provider: "google",
    ngpus: 1,
    instance: "a2-highgpu-1g",
    gpu: "a100",
    cost: 2.93 + 0.74,
  },
  {
    id: 1,
    provider: "google",
    ngpus: 1,
    instance: "n1-standard-1",
    gpu: "t4",
    cost: 0.35 + 0.05,
  },
  {
    id: 2,
    provider: "google",
    ngpus: 1,
    instance: "n1-standard-1",
    gpu: "p4",
    cost: 0.6 + 0.05,
  },
  {
    id: 3,
    provider: "google",
    ngpus: 1,
    instance: "n1-standard-1",
    gpu: "v100",
    cost: 2.48 + 0.05,
  },
  {
    id: 4,
    provider: "google",
    ngpus: 1,
    instance: "n1-standard-1",
    gpu: "p100",
    cost: 1.46 + 0.05,
  },
  {
    id: 6,
    provider: "aws",
    ngpus: 1,
    instance: "p3.2xlarge",
    gpu: "v100",
    cost: 3.06,
  },
  {
    id: 8,
    provider: "aws",
    ngpus: 1,
    instance: "g4dn.xlarge",
    gpu: "t4",
    cost: 0.526,
  },
  {
    id: 10,
    provider: "azure",
    ngpus: 1,
    instance: "NC6s v2",
    gpu: "p100",
    cost: 2.07,
  },
  {
    id: 11,
    provider: "azure",
    ngpus: 1,
    instance: "NC6s v3",
    gpu: "v100",
    cost: 3.06,
  },
  {
    id: 12,
    provider: "azure",
    ngpus: 1,
    instance: "NC4as T4 v3",
    gpu: "t4",
    cost: 0.526,
  },

  // {
  //   id: 13,
  //   provider: "centml",
  //   ngpus: 1,
  //   instance: "CentML",
  //   gpu: "rtx2080ti",
  //   cost: 0.2,
  // },

  // 2/4 GPU instances

  {
    id: 14,
    provider: "google",
    ngpus: 2,
    instance: "a2-highgpu-2g",
    gpu: "a100",
    cost: 5.87 + 1.48,
  },
  {
    id: 15,
    provider: "google",
    ngpus: 2,
    instance: "n1-standard-1",
    gpu: "t4",
    cost: 2 * 0.35 + 0.05,
  },
  {
    id: 16,
    provider: "google",
    ngpus: 2,
    instance: "n1-standard-1",
    gpu: "p4",
    cost: 2 * 0.6 + 0.05,
  },
  {
    id: 17,
    provider: "google",
    ngpus: 2,
    instance: "n1-standard-1",
    gpu: "v100",
    cost: 2 * 2.48 + 0.05,
  },
  {
    id: 18,
    provider: "google",
    ngpus: 2,
    instance: "n1-standard-1",
    gpu: "p100",
    cost: 2 * 1.46 + 0.05,
  },
  {
    id: 20,
    provider: "aws",
    ngpus: 4,
    instance: "g4dn.12xlarge",
    gpu: "t4",
    cost: 3.912,
  },

  {
    id: 21,
    provider: "google",
    ngpus: 4,
    instance: "a2-highgpu-4g",
    gpu: "a100",
    cost: 11.74 + 2.96,
  },
  {
    id: 22,
    provider: "google",
    ngpus: 4,
    instance: "n1-standard-1",
    gpu: "t4",
    cost: 4 * 0.35 + 0.05,
  },
  {
    id: 23,
    provider: "google",
    ngpus: 4,
    instance: "n1-standard-1",
    gpu: "p4",
    cost: 4 * 0.6 + 0.05,
  },
  {
    id: 24,
    provider: "google",
    ngpus: 4,
    instance: "n1-standard-1",
    gpu: "v100",
    cost: 4 * 2.48 + 0.05,
  },
  {
    id: 25,
    provider: "google",
    ngpus: 4,
    instance: "n1-standard-1",
    gpu: "p100",
    cost: 4 * 1.46 + 0.05,
  },
  {
    id: 27,
    provider: "aws",
    ngpus: 4,
    instance: "p3.8xlarge",
    gpu: "v100",
    cost: 12.24,
  },
  {
    id: 28,
    provider: "azure",
    ngpus: 2,
    instance: "NC12s v2",
    gpu: "p100",
    cost: 4.14,
  },
  {
    id: 29,
    provider: "azure",
    ngpus: 4,
    instance: "NC24rs v2",
    gpu: "p100",
    cost: 9.1080,
  },
  {
    id: 30,
    provider: "azure",
    ngpus: 2,
    instance: "NC12s v3",
    gpu: "v100",
    cost: 6.12,
  },
  {
    id: 31,
    provider: "azure",
    ngpus: 4,
    instance: "NC24rs v3",
    gpu: "v100",
    cost: 13.46,
  },
  {
    id: 32,
    provider: "azure",
    ngpus: 4,
    instance: "NC64as T4 v3",
    gpu: "t4",
    cost: 4.352,
  },
];

export const cloudProviders = {
  google: {
    name: "Google Cloud Platform",
    logo: "resources/google.png",
    color: "#ea4335",
  },
  azure: {
    name: "Microsoft Azure",
    logo: "resources/azure.jpg",
    color: "#008AD7",
  },
  aws: {
    name: "Amazon Web Services",
    logo: "resources/aws.png",
    color: "#ff9900",
  },
}

export const gpuPropertyList = [
  { name: "p100", vmem: 16, type: "server" },
  { name: "p4000", vmem: 8, type: "server" },
  { name: "rtx2070", vmem: 8, type: "consumer" },
  { name: "rtx2080ti", vmem: 11, type: "consumer" },
  { name: "t4", vmem: 16, type: "server" },
  { name: "v100", vmem: 16, type: "server" },
  { name: "a100", vmem: 40, type: "server" },
  { name: "rtx3090", vmem: 24, type: "consumer" },
  { name: "a40", vmem: 48, type: "server" },
  { name: "a4000", vmem: 16, type: "server" },
  { name: "rtx4000", vmem: 8, type: "consumer" }
];

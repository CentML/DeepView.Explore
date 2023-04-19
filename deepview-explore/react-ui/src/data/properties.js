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
  { name: "rtx4000", vmem: 8, type: "consumer" },
];

/**
 * COLOR DATA FOR DEPLOYMENT SCATTER GRAPH
 */
export const deploymentScatterGraphColorSize = {
  HIGHLIGHTCOLOR: "#9b59b6",
  NORMALSIZE: 200,
  HIGHLIGHTSIZE: 280,
};

export let CENTML_CLOUD_PROVIDERS_URL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  CENTML_CLOUD_PROVIDERS_URL = "providers.json";
} else {
  CENTML_CLOUD_PROVIDERS_URL = "https://deepview-explorer-public.s3.amazonaws.com/vscode-cloud-providers/providers.json";
}


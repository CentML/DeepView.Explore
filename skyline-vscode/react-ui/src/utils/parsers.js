import Ajv from "ajv";
import {
  gpuPropertyList,
  deploymentScatterGraphColorSize,
} from "../data/properties";
import { cloudProviderSchema } from "../schema/CloudProvidersSchema";

const ajv = new Ajv({ allErrors: true }); // to report all validation errors (rather than failing on the first errors)
const validate = ajv.compile(cloudProviderSchema);

class ResponseBuffer {
  constructor() {
    this.instanceId = 0;
    this.instanceArray = [];
    this.cloudProviders = {};
    this.errors = [];
  }
}
export const loadJsonFiles = async (habitatData, additionalProviders) => {
  const buffer = new ResponseBuffer();
  let urlList = [
    "https://deepview-explorer-public.s3.amazonaws.com/vscode-cloud-providers/providers.json",
  ];
  const additionalList = additionalProviders ? additionalProviders.split(","):[];
  urlList = urlList.concat(additionalList);
  const listOfPromises = urlList.map((url) =>
    fetch(url, { cache: "no-store" })
  );
  const responses = await Promise.all(listOfPromises);
  for (let resp of responses) {
    if (resp.ok) {
      try {
        const respJsonData = await resp.json();
        const valid = validate(respJsonData);
        if (valid) {
          for (const cloudProvider of respJsonData) {
            buffer.cloudProviders[cloudProvider.name.toLocaleLowerCase()] = {
              name: cloudProvider.name,
              logo: cloudProvider.logo,
              color: cloudProvider.color,
            };
            for (const instanceData of cloudProvider.instances) {
              const found_in_habitat = habitatData.find(
                (item) =>
                  item[0].toLowerCase() === instanceData.gpu.toLowerCase()
              );
              const found_in_gpuPropertyList = gpuPropertyList.find(
                (item) =>
                  item.name.toLocaleLowerCase() ===
                  instanceData.gpu.toLocaleLowerCase()
              );
              buffer.instanceArray.push({
                id: buffer.instanceId,
                x: found_in_habitat[1], // msec
                y: (instanceData.cost / 3.6e6) * found_in_habitat[1], // cost per msec * habitatData = cost per 1 iteration
                info: {
                  instance: instanceData.name.toLocaleLowerCase(),
                  gpu: instanceData.gpu.toLocaleLowerCase(),
                  ngpus: instanceData.ngpus,
                  cost: instanceData.cost,
                  provider: cloudProvider.name.toLocaleLowerCase(),
                },
                vmem: found_in_gpuPropertyList.vmem,
                fill: cloudProvider.color,
                z: deploymentScatterGraphColorSize.NORMALSIZE,
              });
              buffer.instanceId += 1;
            }
          }
        } else {
          buffer.errors.push({
            msg: `invalid data format from url: ${resp.url}`,
            invalidFields: validate.errors.map((err) => ({
              field: err.instancePath,
              err: err.message,
            })),
          });
        }
      } catch (error) {
        buffer.errors.push({
          msg: `error reading from url: ${resp.url}`,
          code: `status: ${resp.statusText} | code: ${resp.status}`,
        });
      }
    } else {
      buffer.errors.push({
        msg: `error reading from url: ${resp.url}`,
        code: `status: ${resp.statusText} | code: ${resp.status}`,
      });
    }
  }
  return {
    cloudProviders: Object.keys(buffer.cloudProviders).length > 0 ? buffer.cloudProviders: null,
    instanceArray: buffer.instanceArray.length > 0 ? buffer.instanceArray:null,
    errors: buffer.errors.length > 0 ? buffer.errors:null,
  };
};

import Ajv from "ajv";
import {
  gpuPropertyList,
  CENTML_CLOUD_PROVIDERS_URL,
  deploymentScatterGraphColorSize,
} from "../data/properties";
import { getErrMsgFromInvalidURL } from "../utils/utils";
import { cloudProviderSchema } from "../schema/CloudProvidersSchema";

const ajv = new Ajv({ allErrors: true }); // to report all validation errors (rather than failing on the first errors)
const validate = ajv.compile(cloudProviderSchema);

export const loadJsonFiles = async (habitatData, cloudProviderURLs) => {
  let instanceId = 0;
  const instanceArray = [];
  const cloudProviders = {};
  const errors = [];

  // const buffer = new cloudProviderAndInstancesBuilder();
  let urlList = [CENTML_CLOUD_PROVIDERS_URL];
  const additionalList = cloudProviderURLs ? cloudProviderURLs.split(",") : [];
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
            cloudProviders[cloudProvider.name.toLocaleLowerCase()] = {
              name: cloudProvider.name,
              logo: cloudProvider.logo,
              color: cloudProvider.color,
              regions: cloudProvider.regions,
              pue: cloudProvider.pue,
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
                  provider: cloudProvider.name.toLocaleLowerCase(),
                },
                regions: instanceData.regions,
                vmem: found_in_gpuPropertyList.vmem,
                fill: cloudProvider.color,
                z: deploymentScatterGraphColorSize.NORMALSIZE,
              });
              instanceId += 1;
            }
          }
        } else {
          errors.push({
            msg: `invalid data format from url: ${resp.url}`,
            invalidFields: validate.errors.map((err) => ({
              field: err.instancePath,
              err: err.message,
            })),
          });
        }
      } catch (error) {
        errors.push(getErrMsgFromInvalidURL("noJsonResponseFromUrl", resp));
      }
    } else {
      errors.push(getErrMsgFromInvalidURL("invalidUrl", resp));
    }
  }
  return {
    cloudProviders:
      Object.keys(cloudProviders).length > 0 ? cloudProviders : null,
    instanceArray: instanceArray.length > 0 ? instanceArray : null,
    errors: errors.length > 0 ? errors : null,
  };
};

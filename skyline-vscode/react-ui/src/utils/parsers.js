/**
 * Yaml parser
 */
import { load } from "js-yaml";
import {
  gpuPropertyList,
  deploymentScatterGraphColorSize,
} from "../data/properties";

class ResponseBuffer{
  constructor(){
    this.instanceId = 0;
    this.instanceArray = [];
    this.cloudProviders = {};
  }
}

export const loadYamlFile = async (habitatData, additionalProviders) => {
  const buffer = new ResponseBuffer();
  //data/providers.yaml
  const response = await fetch("https://sandbox-public-data.s3.us-east-2.amazonaws.com/centml/providers.yaml",
  { cache: "no-store" }); 
  if (!response.ok) {
    console.log("Could not read local file");
    return { cloudProviders: null, instanceArray: null };
  }
  const localDataText = await response.text();
  const localDataYaml = load(localDataText);
  CloudProviderReader(localDataYaml, habitatData,buffer);
  CloudProviderReader(additionalProviders, habitatData,buffer);
  return { cloudProviders: buffer.cloudProviders, instanceArray: buffer.instanceArray };
};

const CloudProviderReader = (data, habitatData,storageBuffer) => {
  if (data && habitatData) {
    for (const [key, value] of Object.entries(data)) {
      if (!value) {
        continue;
      }
      const cloudProviderName = key.toLocaleLowerCase();
      if (!(cloudProviderName in storageBuffer.cloudProviders)) {
        storageBuffer.cloudProviders[cloudProviderName] = {
          name: value.name,
          logo: value.logo,
          color: value.color,
        };
      }
      if (value.instances) {
        for (const instanceData of value.instances) {
          if (
            instanceData.ngpus &&
            Number.isInteger(instanceData.ngpus) &&
            instanceData.ngpus !== 0 &&
            instanceData.cost &&
            typeof instanceData.cost === "number"
          ) {
            const instanceAlreadyInArr = storageBuffer.instanceArray.find(
              (item) =>
                item.info.provider === cloudProviderName &&
                item.info.gpu === instanceData.gpu &&
                item.info.instance === instanceData.name &&
                item.info.ngpus === instanceData.ngpus
            );
            if (instanceAlreadyInArr) {
              instanceAlreadyInArr.info.cost = instanceData.cost;
              instanceAlreadyInArr.y =
                (instanceData.cost / 3.6e6) * instanceAlreadyInArr.x;
            } else {
              const found_in_habitat = habitatData.find(
                (item) =>
                  item[0].toLowerCase() === instanceData.gpu?.toLowerCase()
              );
              const found_in_gpuPropertyList = gpuPropertyList.find(
                (item) =>
                  item.name.toLocaleLowerCase() ===
                  instanceData.gpu?.toLocaleLowerCase()
              );
              if (found_in_habitat && found_in_gpuPropertyList) {
                storageBuffer.instanceArray.push({
                  id: storageBuffer.instanceId,
                  x: found_in_habitat[1], // msec
                  y: (instanceData.cost / 3.6e6) * found_in_habitat[1], // cost per msec * habitatData = cost per 1 iteration
                  info: {
                    instance: instanceData.name?.toLocaleLowerCase(),
                    gpu: instanceData.gpu?.toLocaleLowerCase(),
                    ngpus: instanceData.ngpus,
                    cost: instanceData.cost,
                    provider: cloudProviderName.toLocaleLowerCase(),
                  },
                  vmem: found_in_gpuPropertyList.vmem,
                  fill: value.color,
                  z: deploymentScatterGraphColorSize.NORMALSIZE,
                });
                storageBuffer.instanceId += 1;
              }
            }
          }
        }
      }
    }
  }
};

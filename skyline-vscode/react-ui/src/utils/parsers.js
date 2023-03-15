/**
 * Yaml parser
 */
import { load } from "js-yaml";
import {
  gpuPropertyList,
  deploymentScatterGraphColorSize,
} from "../data/properties";

let instanceID = 0;
let instanceArray = [];
let cloudProviders = {};

export const loadYamlFile = async (habitatData, additionalProviders) => {
  const response = await fetch("data/providers.yaml");
  if (!response.ok) {
    console.log("Could not read local file");
  }
  const localDataText = await response.text();
  const localDataYaml = load(localDataText);
  CloudProviderReader(localDataYaml, habitatData);
  CloudProviderReader(additionalProviders, habitatData);
  return { cloudProviders, instanceArray };
};

const CloudProviderReader = (data, habitatData) => {
  if (data && habitatData) {
    for (const [key, value] of Object.entries(data)) {
      const cloudProviderName = key.toLocaleLowerCase();
      if (!(cloudProviderName in cloudProviders)) {
        cloudProviders[cloudProviderName] = {
          name: value.name,
          logo: value.logo,
          color: value.color,
        };
      }
      for (const instanceData of value.instances) {
        if (
          instanceData.ngpus &&
          Number.isInteger(instanceData.ngpus) &&
          instanceData.ngpus !== 0 &&
          instanceData.cost &&
          typeof instanceData.cost === "number"
        ) {
          const instanceAlreadyInArr = instanceArray.find(
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
              (item) => item[0].toLowerCase() === instanceData.gpu.toLowerCase()
            );
            const found_in_gpuPropertyList = gpuPropertyList.find(
              (item) =>
                item.name.toLocaleLowerCase() ===
                instanceData.gpu.toLocaleLowerCase()
            );
            if (found_in_habitat && found_in_gpuPropertyList) {
              instanceArray.push({
                id: instanceID,
                x: found_in_habitat[1], // msec
                y: (instanceData.cost / 3.6e6) * found_in_habitat[1], // cost per msec * habitatData = cost per 1 iteration
                info: {
                  instance: instanceData.name.toLocaleLowerCase(),
                  gpu: instanceData.gpu.toLocaleLowerCase(),
                  ngpus: instanceData.ngpus,
                  cost: instanceData.cost,
                  provider: cloudProviderName.toLocaleLowerCase(),
                },
                vmem: found_in_gpuPropertyList.vmem,
                fill: value.color,
                z: deploymentScatterGraphColorSize.NORMALSIZE,
              });
              instanceID += 1;
            }
          }
        }
      }
    }
  }
};

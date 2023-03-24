/**
 * Yaml parser
 */
import { load } from "js-yaml";
import Ajv from "ajv";
import {
  gpuPropertyList,
  deploymentScatterGraphColorSize,
} from "../data/properties";
import { cloudProviderSchema } from "../schema/CloudProvidersSchema";

const ajv = new Ajv({ allErrors: true }); // to report all validation errors (rather than failing on the first errors)
const validate = ajv.compile(cloudProviderSchema);

const data = [
  {
    name: "gcp",
    logo: "",
    color: "#ea4335",
    instances: [{ name: "a2-highgpu-1g", gpu: "a100", ngpus: 1, cost: 0.05 }],
  },
];

const valid = validate(data);
if (!valid) {
  console.log("Error");
  validate.errors.forEach((err) => console.log(err.message));
}

class ResponseBuffer {
  constructor() {
    this.instanceId = 0;
    this.instanceArray = [];
    this.cloudProviders = {};
  }
}

export const loadYamlFile = async (habitatData, additionalProviders) => {
  const buffer = new ResponseBuffer();
  //data/providers.yaml
  let urlList = [
    "https://deepview-explorer-public.s3.amazonaws.com/vscode-cloud-providers/providers.yaml",
  ];
  urlList = urlList.concat(additionalProviders);
  const listOfPromises = urlList.map((url) =>
    fetch(url, { cache: "no-store" })
  );
  try {
    const responses = await Promise.all(listOfPromises);
    for (let resp of responses) {
      if (resp.ok) {
        const localDataText = await resp.text();
        const localDataYaml = load(localDataText);
        CloudProviderReader(localDataYaml, habitatData, buffer);
      } else {
        console.log("error reading from url: ", resp.url);
      }
    }
    return {
      cloudProviders: buffer.cloudProviders,
      instanceArray: buffer.instanceArray,
    };
  } catch (error) {
    console.log("There was an error", error);
  }
};

const CloudProviderReader = (data, habitatData, storageBuffer) => {
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

export const loadJsonFiles = async (habitatData, additionalProviders) => {
  const buffer = new ResponseBuffer();
  let urlList = [
    "https://deepview-explorer-public.s3.amazonaws.com/vscode-cloud-providers/providers.json",
  ];
  urlList = urlList.concat(additionalProviders);
  const listOfPromises = urlList.map((url) =>
    fetch(url, { cache: "no-store" })
  );
  try {
    const responses = await Promise.all(listOfPromises);
    for (let resp of responses) {
      if (resp.ok) {
        const respJsonData = await resp.json();
        const valid = validate(respJsonData);
        if (valid) {
          console.log(respJsonData);
        } else {
          console.log("Error");
          validate.errors.forEach((err) => console.log(err.message));
        }
      } else {
        console.log("error reading from url: ", resp.url);
      }
    }
    return {
      cloudProviders: buffer.cloudProviders,
      instanceArray: buffer.instanceArray,
    };
  } catch (error) {
    console.log("There was an error", error);
  }
};

const yaml = require('js-yaml');
const fs   = require('fs');

import {EnergyConsumptionComponentType} from './protobuf/innpv_pb'; 
export const energy_component_type_mapping = (code: number):string => {
    let result:string="INVALID";
    switch(code) {
        case EnergyConsumptionComponentType.ENERGY_UNSPECIFIED:
            result = 'ENERGY_UNSPECIFIED';
            break;
        case EnergyConsumptionComponentType.ENERGY_CPU_DRAM:
            result = 'ENERGY_CPU_DRAM';
            break;
        case EnergyConsumptionComponentType.ENERGY_NVIDIA:
            result = 'ENERGY_GPU';
            break;
    }
    return result;    
}

export const yaml_loader = (pathToFile:String):Object | null => {
    let yamlFile:Object | null = null;
    try {
        const doc = yaml.load(fs.readFileSync(pathToFile, 'utf8'));
        yamlFile = doc;
      } catch (e) {
        console.log("Could not read the file",e);
      }

    return yamlFile;
}
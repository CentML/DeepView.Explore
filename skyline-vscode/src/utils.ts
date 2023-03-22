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
};

export const getObjectKeyNameFromValue = (obj: Object, val: any): string | undefined => {
    return Object.keys(obj).find(key => obj[key as keyof Object] === val);
};

export const filterObjectByKeyName = (obj: Object, prefix: string): Object => {
    return Object.fromEntries(Object.entries(obj).filter(([key, val])=> key.startsWith(prefix)));
};

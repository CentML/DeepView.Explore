'use babel';

import { ContinuousSizeLegend } from "react-vis";

// import path from 'path';

const BYTE_UNITS = [
  'B',
  'KB',
  'MB',
  'GB',
];

const ENERGY_UNITS = [
  'J',
  'KJ',
  'MJ',
  'GJ',
  'TJ',
  'PJ',
  'EJ'
]

const GENERIC_UNITS = [
  '',
  'Thousands',
  'Millions',
  "Billions",
  'Trillion',
  'Quadrillion'
]

const formatTimeUnits = [
  [365,'day'],
  [24, 'hour'],
  [60, 'minute'],
  [60, 'second'],
  [1000,'msec']
]

// reference : https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator
const ENERGY_CONVERSION_UNITS = {
  kwh: 2.77778e-7, // 1J = 2.77778e-7 kwh
  carbon: 7.09e-4, // Electricity consumed (kilowatt-hours) : 7.09 × 10-4 metric tons CO2/kWh
  miles: 1/(4.03e-4), // Miles driven by the average gasoline-powered passenger vehicle : 4.03 x 10-4 metric tons CO2E/mile
  household: 1/7.94, // Home energy use : 7.94 metric tons CO2 per home per year.
  phone: 1/(8.22e-6) // 8.22 x 10-6 metric tons CO2/smartphone charged
}

export function unitScale(quantity, unit){
  let idx = 0;
  while(quantity > 1000){
    quantity /=1000;
    idx +=1;
  }

  switch(unit){
    case 'energy':
      return {val:parseFloat(Number(quantity).toFixed(2)),scale:ENERGY_UNITS[idx],scale_index:idx}
    case 'generic':
      return {val:parseFloat(Number(quantity).toFixed(2)),scale:GENERIC_UNITS[idx],scale_index:idx}
    default:
      return null
  }

}

export function timeFormatter(quantity){
  if (quantity >= 1){
    return `${quantity} homes' energy use for one year`
  }
  let idx = 0;
  let converter = [];
  while(quantity < 1){
    converter = formatTimeUnits[idx];
    quantity *= converter[0];
    idx+=1;
  }
  return [parseFloat(Number(quantity).toFixed(2)),converter[1]];
}


// export function processFileReference(fileReferenceProto) {
//   return {
//     filePath: path.join(...(fileReferenceProto.getFilePath().getComponentsList())),
//     lineNumber: fileReferenceProto.getLineNumber(),
//   };
// };

export function toPercentage(numerator, denominator) {
  return numerator / denominator * 100;
};

export function toReadableByteSize(sizeBytes) {
  let index = 0;
  let size = sizeBytes;
  for (; index < BYTE_UNITS.length; index++) {
    if (size < 1000) {
      break;
    }
    size /= 1024;
  }
  if (index == BYTE_UNITS.length) {
    index--;
  }

  return `${size.toFixed(1)} ${BYTE_UNITS[index]}`;
};

export function scalePercentages({scaleSelector, shouldScale, applyFactor}) {
  return function(list, scaleFactor) {
    let total = 0;
    const adjusted = [];

    for (const element of list) {
      const value = scaleSelector(element);
      if (shouldScale(element)) {
        const scaled = value * scaleFactor;
        adjusted.push([scaled, element]);
        total += scaled;
      } else {
        adjusted.push([value, element]);
        total += value;
      }
    }

    return adjusted.map(([newValue, element]) =>
      applyFactor(element, toPercentage(newValue, total)));
  };
};

export function getTraceByLevel(tree) {
  console.log("getTraceByLevel");
  var tree_size = function(idx) {
    let total = 1;
    let num_children = tree[idx]["num_children"];
    for (let i = 0; i < num_children; i++) {
      tree[idx+total]["depth"] = 1 + tree[idx]["depth"];
      tree[idx+total]["parent"] = tree[idx];
      total += tree_size(idx + total);
    }
    return total;
  };

  tree[0]["depth"] = 0;
  tree_size(0);

  let coarseDecomposition = tree.filter(node => { return node["depth"] == 1; });
  for (let fineLevel = 1; ; fineLevel ++) {
    let fineDecomposition = tree.filter(node => { return node["depth"] == fineLevel; });
    console.log(`fineLevel: ${fineLevel}, length: ${fineDecomposition.length}`);
    if (fineDecomposition.length == 0) return { coarse: coarseDecomposition, fine: coarseDecomposition };
    if (fineDecomposition.length >= 7) return { coarse: coarseDecomposition, fine: fineDecomposition };
  }
}

export function computePercentage(operations, total_time) {
  let tracked_total_time = 0;
  for (let elem in operations) {
    tracked_total_time += operations[elem]["forward_ms"] + operations[elem]["backward_ms"];
  }
  total_time = Math.max(total_time, tracked_total_time);

  for (let elem in operations) {
    operations[elem]["percentage"] = 100 * (operations[elem]["forward_ms"] + operations[elem]["backward_ms"]) / total_time;
  }

  if (tracked_total_time < total_time) {
    operations.push({
      name: "untracked",
      percentage: 100 * (total_time - tracked_total_time) / total_time,
      num_children: 0,
      forward_ms: 0,
      backward_ms: 0,
      size_bytes: 0,
      total_time: total_time - tracked_total_time
    });
  }

  return operations;
}

export function energy_data(currentTotal){
  const kwh = currentTotal * ENERGY_CONVERSION_UNITS['kwh'];
  const carbon_emission_tons = kwh*ENERGY_CONVERSION_UNITS['carbon'];
  const carbon_unit = carbon_emission_tons < 1 ? 
      `${parseFloat(Number(carbon_emission_tons*1000).toFixed(2))} kg`: 
      `${parseFloat(Number(carbon_emission_tons).toFixed(2))} Metric Tons`;
  const miles = unitScale(carbon_emission_tons * ENERGY_CONVERSION_UNITS['miles'],'generic');
  const household = timeFormatter(carbon_emission_tons * ENERGY_CONVERSION_UNITS['household']);
  const phone = unitScale(carbon_emission_tons * ENERGY_CONVERSION_UNITS['phone'],'generic');

  return {
    kwh: parseFloat(Number(kwh).toFixed(2)),
    carbon: carbon_unit,
    miles: `${miles.val} ${miles.scale}`,
    household: household,
    phone: `${phone.val} ${phone.scale}`
  }

}

export function calculate_training_time(numIterations, instance){
  // instance.x is the time for 1 iterations in msec
  // 3.6e6 to convert total training time from msec to hours, divided by the total number of GPUS
  // output is in hours
  return numIterations * instance.x / 3.6e6 / instance.info.ngpus;
}

export function numberFormat(num){
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "long",
  });
  return formatter.format(num);
}

export function currencyFormat(cost){
  const scientificFormater = new Intl.NumberFormat("en-US", {
    style: 'currency', 
    currency: 'USD',
    notation: "compact",
    compactDisplay: "short",
  });
  return scientificFormater.format(cost);
}
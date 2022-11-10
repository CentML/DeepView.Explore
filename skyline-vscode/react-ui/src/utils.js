'use babel';

// import path from 'path';

const BYTE_UNITS = [
  'B',
  'KB',
  'MB',
  'GB',
];

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

export function getTopLevelTraces(tree) {
  var tree_size = function(idx) {
    let total = 1;
    let top_level = [];
    let num_children = tree[idx]["num_children"];
    for (let i = 0; i < num_children; i++) {
      top_level.push(tree[idx+total]);
      let ret = tree_size(idx + total);
      total += ret.total;
    }
    return { total, top_level };
  };

  let { total, top_level } = tree_size(0);
  return top_level;
}
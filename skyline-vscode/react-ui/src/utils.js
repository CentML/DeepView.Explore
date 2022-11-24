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

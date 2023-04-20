import {
  currencyFormat,
  numberFormat,
  calculate_training_time,
  energy_data,
  homeEnergyUsedFormat,
  unitScale
} from "./utils";

test('Unit Scale', () => {
    // Energy
    expect(unitScale(40,'energy')).toStrictEqual({"scale": "J", "scale_index": 0, "val": 40});
    expect(unitScale(4.1e3,'energy')).toStrictEqual({"scale": "KJ", "scale_index": 1, "val": 4.1});
    expect(unitScale(4.1e5,'energy')).toStrictEqual({"scale": "KJ", "scale_index": 1, "val": 410});
    expect(unitScale(4.1e6,'energy')).toStrictEqual({"scale": "MJ", "scale_index": 2, "val": 4.1});
    expect(unitScale(4.1e8,'energy')).toStrictEqual({"scale": "MJ", "scale_index": 2, "val": 410});
    expect(unitScale(4.1e9,'energy')).toStrictEqual({"scale": "GJ", "scale_index": 3, "val": 4.1});
    expect(unitScale(4.1e11,'energy')).toStrictEqual({"scale": "GJ", "scale_index": 3, "val": 410});
    expect(unitScale(4.1e12,'energy')).toStrictEqual({"scale": "TJ", "scale_index": 4, "val": 4.1});
    expect(unitScale(4.1e14,'energy')).toStrictEqual({"scale": "TJ", "scale_index": 4, "val": 410});
    expect(unitScale(4.1e15,'energy')).toStrictEqual({"scale": "PJ", "scale_index": 5, "val": 4.1});
    expect(unitScale(4.1e17,'energy')).toStrictEqual({"scale": "PJ", "scale_index": 5, "val": 410});
    expect(unitScale(4.1e18,'energy')).toStrictEqual({"scale": "EJ", "scale_index": 6, "val": 4.1});
    // Generic
    expect(unitScale(40,'generic')).toStrictEqual({"scale": "", "scale_index": 0, "val": 40});
    expect(unitScale(400,'generic')).toStrictEqual({"scale": "", "scale_index": 0, "val": 400});
    expect(unitScale(4e3,'generic')).toStrictEqual({"scale": "Thousands", "scale_index": 1, "val": 4.0});
    expect(unitScale(4.2e5,'generic')).toStrictEqual({"scale": "Thousands", "scale_index": 1, "val": 420});
    expect(unitScale(4.2e6,'generic')).toStrictEqual({"scale": "Millions", "scale_index": 2, "val": 4.2});
    expect(unitScale(4.2e8,'generic')).toStrictEqual({"scale": "Millions", "scale_index": 2, "val": 420});
    expect(unitScale(4.2e9,'generic')).toStrictEqual({"scale": "Billions", "scale_index": 3, "val": 4.2});
    expect(unitScale(4.2e11,'generic')).toStrictEqual({"scale": "Billions", "scale_index": 3, "val": 420});
    expect(unitScale(4.2e12,'generic')).toStrictEqual({"scale": "Trillion", "scale_index": 4, "val": 4.2});
    expect(unitScale(4.2e14,'generic')).toStrictEqual({"scale": "Trillion", "scale_index": 4, "val": 420});
    expect(unitScale(4.2e15,'generic')).toStrictEqual({"scale": "Quadrillion", "scale_index": 5, "val": 4.2});
})

test('Home energy used format', () => {
    expect(homeEnergyUsedFormat(1)).toStrictEqual([1,'year']);
    expect(homeEnergyUsedFormat(1e-1)).toStrictEqual([36.5,'day']);
    expect(homeEnergyUsedFormat(1e-3)).toStrictEqual([8.76,'hour']);
    expect(homeEnergyUsedFormat(1e-4)).toStrictEqual([52.56,'minute']);
    expect(homeEnergyUsedFormat(1e-6)).toStrictEqual([31.54,'second']);
    expect(homeEnergyUsedFormat(1e-8)).toStrictEqual([315.36,'msec']);
})

test("energy conversion", () => {
  const totalEnergy = 1.84e6;
  expect(energy_data(totalEnergy)).toStrictEqual({
    kwh: 0.51,
    carbon: "0.22 kg",
    miles: "0.55 ",
    household: [14.65,"minute"],
    phone: "26.92 ",
  });
});

test("Calculate training time", () => {
  const numIterations = 200000;
  const instance = {
    x: 14.069682,
    info: {
      ngpus: 4,
    },
  };
  expect(calculate_training_time(numIterations, instance)).toBe(
    0.19541224999999998
  );
});

test("format number: expect number 3991558 to be 4 million", () => {
  expect(numberFormat(3991558)).toBe("4 million");
});

test("format currency: expect number 3991558 to be $4M", () => {
  expect(currencyFormat(3991558)).toBe("$4M");
});

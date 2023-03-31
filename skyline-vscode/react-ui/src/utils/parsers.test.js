import { loadJsonFiles } from "./parsers";
import { enableFetchMocks } from "jest-fetch-mock";
enableFetchMocks();

const habitatData = [
  ["source", 22.029312],
  ["P100", 14.069682],
  ["P4000", 127.268085], // 27.268085
  ["RTX2070", 16.088268],
  ["RTX2080Ti", 11.826558],
  ["T4", 22.029312],
  ["V100", 10.182922],
  ["A100", 10.068596],
  ["RTX3090", 9.841998],
  ["A40", 11.558072],
  ["A4000", 14.67059],
  ["RTX4000", 20.2342],
];

const correctData = [
  {
    name: "gcp",
    logo: "resources/google.png",
    color: "#ea4335",
    instances: [
      {
        name: "a2-highgpu-1g",
        gpu: "a100",
        ngpus: 1,
        cost: 3.67,
      },
    ],
  },
  {
    name: "aws",
    logo: "resources/aws.png",
    color: "#ff9900",
    instances: [
      {
        name: "p3.2xlarge",
        gpu: "v100",
        ngpus: 1,
        cost: 3.06,
      },
    ],
  },
];

const incorrectData = [
  {
    name: "gcp",
    logo: "resources/google.png",
    color: "#ea4335",
    instances: [
      {
        name: "a2-highgpu-1g",
        gpu: "a100",
        ngpus: 1,
        cost: 3.67,
      },
    ],
  },
  {
    name: "aws",
    logo: "resources/aws.png",
    instances: [
      {
        name: "p3.2xlarge",
        gpu: "rtx3050",
        ngpus: 0,
        cost: -3.06,
      },
    ],
  },
];

test("Validate JSON file (URL) and return list of cloud providers and instances", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(correctData),
  });
  const resp = await loadJsonFiles(habitatData, "");
  expect(resp.errors).toBeNull();
});

//TODO mshin: Add tests to test out optional params

test("JSON file (URL) is not in the correct format", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue(incorrectData),
  });
  const resp = await loadJsonFiles(habitatData, "");
  expect(resp).toBeDefined();
  expect(resp.cloudProviders).toBeNull()
  expect(resp.instanceArray).toBeNull()
  expect(resp.errors[0].msg).toMatch(/invalid data format from url/)
});

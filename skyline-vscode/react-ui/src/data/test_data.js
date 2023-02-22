export const labels = [
  { label: "", percentage: 0.1711083135902288, clickable: false },
  { label: "", percentage: 0.01741821166351814, clickable: false },
  { label: "", percentage: 0.07889425299332373, clickable: false },
  { label: "layer4.0", percentage: 15.335198314446881, clickable: false },
  { label: "layer3.0", percentage: 28.00233621209079, clickable: false },
  { label: "layer2.0", percentage: 24.773819017726606, clickable: false },
  { label: "layer1.0", percentage: 25.638582363832683, clickable: false },
  { label: "", percentage: 1.3760387158267198, clickable: false },
  { label: "", percentage: 0.7602536847400398, clickable: false },
  { label: "", percentage: 1.6301396557185361, clickable: false },
  { label: "", percentage: 2.216211257370674, clickable: false },
];

export const renderPerfBars = [
  {
    name: "linear",
    num_children: 0,
    forward_ms: 0.02184533327817917,
    backward_ms: 0.03515733405947685,
    size_bytes: 131072,
    file_refs: [],
    depth: 1,
    parent: {
      name: "root",
      num_children: 11,
      forward_ms: 12.462421417236328,
      backward_ms: 20.851369857788086,
      size_bytes: 1386957824,
      file_refs: [
        {
          path: "resnet.py",
          line_no: 182,
          run_time_ms: 0.7383040189743042,
          size_bytes: 9633792,
        },
        {
          path: "resnet.py",
          line_no: 183,
          run_time_ms: 0.5430613160133362,
          size_bytes: 52429824,
        },
        {
          path: "resnet.py",
          line_no: 184,
          run_time_ms: 0.25326934456825256,
          size_bytes: 52428800,
        },
        {
          path: "resnet.py",
          line_no: 185,
          run_time_ms: 0.4584106504917145,
          size_bytes: 25690112,
        },
        {
          path: "resnet.py",
          line_no: 187,
          run_time_ms: 8.541183471679688,
          size_bytes: 534001664,
        },
        {
          path: "resnet.py",
          line_no: 85,
          run_time_ms: 4.606293201446533,
          size_bytes: 0,
        },
        {
          path: "resnet.py",
          line_no: 86,
          run_time_ms: 1.3073066473007202,
          size_bytes: 122387456,
        },
        {
          path: "resnet.py",
          line_no: 87,
          run_time_ms: 0.6290773153305054,
          size_bytes: 122355712,
        },
        {
          path: "resnet.py",
          line_no: 89,
          run_time_ms: 8.89958381652832,
          size_bytes: 0,
        },
        {
          path: "resnet.py",
          line_no: 90,
          run_time_ms: 0.9847466945648193,
          size_bytes: 88833024,
        },
        {
          path: "resnet.py",
          line_no: 91,
          run_time_ms: 0.45499733090400696,
          size_bytes: 88866816,
        },
        {
          path: "resnet.py",
          line_no: 93,
          run_time_ms: 4.2308268547058105,
          size_bytes: 0,
        },
        {
          path: "resnet.py",
          line_no: 94,
          run_time_ms: 3.455317258834839,
          size_bytes: 357554176,
        },
        {
          path: "resnet.py",
          line_no: 97,
          run_time_ms: 3.5921919345855713,
          size_bytes: 110262272,
        },
        {
          path: "resnet.py",
          line_no: 99,
          run_time_ms: 1.3127679824829102,
          size_bytes: 0,
        },
        {
          path: "resnet.py",
          line_no: 100,
          run_time_ms: 1.7585493326187134,
          size_bytes: 356384768,
        },
        {
          path: "resnet.py",
          line_no: 188,
          run_time_ms: 8.253098487854004,
          size_bytes: 372535296,
        },
        {
          path: "resnet.py",
          line_no: 189,
          run_time_ms: 9.32863998413086,
          size_bytes: 264454144,
        },
        {
          path: "resnet.py",
          line_no: 190,
          run_time_ms: 5.108736038208008,
          size_bytes: 75653120,
        },
        {
          path: "resnet.py",
          line_no: 192,
          run_time_ms: 0.026282666251063347,
          size_bytes: 0,
        },
        {
          path: "resnet.py",
          line_no: 193,
          run_time_ms: 0.0058026667684316635,
          size_bytes: 0,
        },
        {
          path: "resnet.py",
          line_no: 194,
          run_time_ms: 0.05700266733765602,
          size_bytes: 131072,
        },
      ],
      depth: 0,
    },
    percentage: 0.1711083135902288,
  },
  {
    name: "flatten",
    num_children: 0,
    forward_ms: 0.003413333324715495,
    backward_ms: 0.0023893334437161684,
    size_bytes: 0,
    file_refs: [],
    depth: 1,
    percentage: 0.01741821166351814,
  },
  {
    name: "adaptive_avg_pool2d",
    num_children: 0,
    forward_ms: 0.015360000543296337,
    backward_ms: 0.010922666639089584,
    size_bytes: 0,
    file_refs: [],
    depth: 1,
    percentage: 0.07889425299332373,
  },
  {
    name: "layer4.0",
    num_children: 11,
    forward_ms: 1.8503680229187012,
    backward_ms: 3.2583680152893066,
    size_bytes: 75653120,
    file_refs: [
      {
        path: "resnet.py",
        line_no: 85,
        run_time_ms: 1.0100053548812866,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 86,
        run_time_ms: 0.1133226677775383,
        size_bytes: 9973760,
      },
      {
        path: "resnet.py",
        line_no: 87,
        run_time_ms: 0.05700266733765602,
        size_bytes: 9961472,
      },
      {
        path: "resnet.py",
        line_no: 89,
        run_time_ms: 1.686527967453003,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 90,
        run_time_ms: 0.08191999793052673,
        size_bytes: 5320704,
      },
      {
        path: "resnet.py",
        line_no: 91,
        run_time_ms: 0.03379200026392937,
        size_bytes: 5373952,
      },
      {
        path: "resnet.py",
        line_no: 93,
        run_time_ms: 0.8311466574668884,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 94,
        run_time_ms: 0.22937600314617157,
        size_bytes: 19316736,
      },
      {
        path: "resnet.py",
        line_no: 97,
        run_time_ms: 0.8942933678627014,
        size_bytes: 6438912,
      },
      {
        path: "resnet.py",
        line_no: 99,
        run_time_ms: 0.077482670545578,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 100,
        run_time_ms: 0.09386666864156723,
        size_bytes: 19267584,
      },
    ],
    depth: 1,
    percentage: 15.335198314446881,
  },
  {
    name: "layer3.0",
    num_children: 11,
    forward_ms: 3.3573546409606934,
    backward_ms: 5.971285343170166,
    size_bytes: 264454144,
    file_refs: [
      {
        path: "resnet.py",
        line_no: 85,
        run_time_ms: 1.815551996231079,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 86,
        run_time_ms: 0.30583465099334717,
        size_bytes: 28913664,
      },
      {
        path: "resnet.py",
        line_no: 87,
        run_time_ms: 0.14267733693122864,
        size_bytes: 28901376,
      },
      {
        path: "resnet.py",
        line_no: 89,
        run_time_ms: 2.986325263977051,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 90,
        run_time_ms: 0.2051413357257843,
        size_bytes: 19279872,
      },
      {
        path: "resnet.py",
        line_no: 91,
        run_time_ms: 0.08806400001049042,
        size_bytes: 19267584,
      },
      {
        path: "resnet.py",
        line_no: 93,
        run_time_ms: 1.6817493438720703,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 94,
        run_time_ms: 0.5908480286598206,
        size_bytes: 78168064,
      },
      {
        path: "resnet.py",
        line_no: 97,
        run_time_ms: 0.8191999793052673,
        size_bytes: 12853248,
      },
      {
        path: "resnet.py",
        line_no: 99,
        run_time_ms: 0.29286399483680725,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 100,
        run_time_ms: 0.40038397908210754,
        size_bytes: 77070336,
      },
    ],
    depth: 1,
    percentage: 28.00233621209079,
  },
  {
    name: "layer2.0",
    num_children: 11,
    forward_ms: 3.1767892837524414,
    backward_ms: 5.0763092041015625,
    size_bytes: 372535296,
    file_refs: [
      {
        path: "resnet.py",
        line_no: 85,
        run_time_ms: 1.0803200006484985,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 86,
        run_time_ms: 0.4505600035190582,
        size_bytes: 44961792,
      },
      {
        path: "resnet.py",
        line_no: 87,
        run_time_ms: 0.22493866086006165,
        size_bytes: 44957696,
      },
      {
        path: "resnet.py",
        line_no: 89,
        run_time_ms: 2.2603094577789307,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 90,
        run_time_ms: 0.26077866554260254,
        size_bytes: 25694208,
      },
      {
        path: "resnet.py",
        line_no: 91,
        run_time_ms: 0.12458667159080505,
        size_bytes: 25690112,
      },
      {
        path: "resnet.py",
        line_no: 93,
        run_time_ms: 0.8956586718559265,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 94,
        run_time_ms: 1.0052266120910645,
        size_bytes: 102776832,
      },
      {
        path: "resnet.py",
        line_no: 97,
        run_time_ms: 1.0629119873046875,
        size_bytes: 25694208,
      },
      {
        path: "resnet.py",
        line_no: 99,
        run_time_ms: 0.37614935636520386,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 100,
        run_time_ms: 0.5116586685180664,
        size_bytes: 102760448,
      },
    ],
    depth: 1,
    percentage: 24.773819017726606,
  },
  {
    name: "layer1.0",
    num_children: 11,
    forward_ms: 3.3675947189331055,
    backward_ms: 5.17358922958374,
    size_bytes: 534001664,
    file_refs: [
      {
        path: "resnet.py",
        line_no: 85,
        run_time_ms: 0.7004159688949585,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 86,
        run_time_ms: 0.4375893473625183,
        size_bytes: 38538240,
      },
      {
        path: "resnet.py",
        line_no: 87,
        run_time_ms: 0.20445865392684937,
        size_bytes: 38535168,
      },
      {
        path: "resnet.py",
        line_no: 89,
        run_time_ms: 1.9664212465286255,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 90,
        run_time_ms: 0.4369066655635834,
        size_bytes: 38538240,
      },
      {
        path: "resnet.py",
        line_no: 91,
        run_time_ms: 0.20855465531349182,
        size_bytes: 38535168,
      },
      {
        path: "resnet.py",
        line_no: 93,
        run_time_ms: 0.822272002696991,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 94,
        run_time_ms: 1.6298667192459106,
        size_bytes: 157292544,
      },
      {
        path: "resnet.py",
        line_no: 97,
        run_time_ms: 0.8157866597175598,
        size_bytes: 65275904,
      },
      {
        path: "resnet.py",
        line_no: 99,
        run_time_ms: 0.566271960735321,
        size_bytes: 0,
      },
      {
        path: "resnet.py",
        line_no: 100,
        run_time_ms: 0.7526400089263916,
        size_bytes: 157286400,
      },
    ],
    depth: 1,
    percentage: 25.638582363832683,
  },
  {
    name: "max_pool2d",
    num_children: 0,
    forward_ms: 0.10922666639089584,
    backward_ms: 0.3491840064525604,
    size_bytes: 25690112,
    file_refs: [],
    depth: 1,
    percentage: 1.3760387158267198,
  },
  {
    name: "relu",
    num_children: 0,
    forward_ms: 0.12697599828243256,
    backward_ms: 0.1262933313846588,
    size_bytes: 52428800,
    file_refs: [],
    depth: 1,
    percentage: 0.7602536847400398,
  },
  {
    name: "add_, batch_norm",
    num_children: 0,
    forward_ms: 0.19865600764751434,
    backward_ms: 0.34440532326698303,
    size_bytes: 52429824,
    file_refs: [],
    depth: 1,
    percentage: 1.6301396557185361,
  },
  {
    name: "conv2d",
    num_children: 0,
    forward_ms: 0.2348373383283615,
    backward_ms: 0.5034666657447815,
    size_bytes: 9633792,
    file_refs: [],
    depth: 1,
    percentage: 2.216211257370674,
  },
];
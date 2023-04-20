import * as esbuild from 'esbuild';
import ifdefPlugin from 'esbuild-ifdef';

let baseOptions = {
  entryPoints: ['./src/extension.js'],
  bundle: true,
  outfile: 'out/main.js',
  external: ['vscode'],
  format: 'cjs',
  platform: "node"
};

let watchPlugin = [
  ifdefPlugin({
    variables: {
      DEBUG: true
    }
  })
];

let productionPlugin = [
  ifdefPlugin({
    variables: {
      DEBUG: false
    }
  })
];

let builds = {
  'base': {
    ...baseOptions,
    sourcemap: true   
  },
  'debug': {
    ...baseOptions,
    sourcemap: true,
    plugins: watchPlugin
  },
  'production': {
    ...baseOptions,
    minify: true,
    plugins: productionPlugin
  }
};

try {


  await esbuild.build(builds[process.argv[2]]);
} catch (error) {
  process.exit(1);
}
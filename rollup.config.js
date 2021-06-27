import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const input = 'src/index.js';
const external = Object.keys(pkg.peerDependencies || {});

const plugins = [terser(
  {
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }
)];

export default [
  //CommonJS
  {
    input,
    output: { file: 'lib/flowregime.js', format: 'cjs', indent: false },
    external,
    plugins,
  },

  //ESM
  {
    input,
    output: { file: 'esm/flowregime.js', format: 'esm', indent: false },
    external,
    plugins,
  },

  //UMD
  {
    input,
    output: {
      file: 'dist/flowregime.js',
      format: 'umd',
      name: 'FlowRegime',
      indent: false
    },
    external,
    plugins,
  },
]
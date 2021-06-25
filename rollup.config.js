import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const input = 'src/index.js';
const external = Object.keys(pkg.peerDependencies || {});
const env = process.env.BUILD;
const ProdEnv = env === 'production';
const CompressionPrefix = ProdEnv ? '.min' : '';
const plugins = [terser(
  ProdEnv ?
    {
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    } : ''
)];

export default [
  //CommonJS
  {
    input,
    output: { file: `lib/flowregime${CompressionPrefix}.js`, format: 'cjs', indent: false },
    external,
    plugins,
  },

  //ESM
  {
    input,
    output: { file: `esm/flowregime${CompressionPrefix}.js`, format: 'esm', indent: false },
    external,
    plugins,
  },

  //UMD
  {
    input,
    output: {
      file: `dist/flowregime${CompressionPrefix}.js`,
      format: 'umd',
      name: 'FlowRegime',
      indent: false
    },
    external,
    plugins,
  },
]
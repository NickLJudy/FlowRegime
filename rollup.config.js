import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const input = 'src/index.js';
const external = Object.keys(pkg.peerDependencies || {});
const env = process.env.NODE_ENV;
const plugins = [terser(
  env === 'production' ? 
  {
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false,
    },
  }:''
)];
const output = [
  {
    file: './dist/flowregime.esm.js',
    format: 'esm',
  },
  {
    file: './dist/flowregime.js',
    format: 'cjs',
  },
];

export default {
  input,
  external,
  plugins,
  output,
}
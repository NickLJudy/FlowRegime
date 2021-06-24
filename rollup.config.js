import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const input = 'src/index.js';
const external = Object.keys(pkg.peerDependencies || {});
const plugins = [terser()];
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
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
  }:''
)];
const output = [
  {
    file: `./dist/flowregime.esm${CompressionPrefix}.js`,
    format: 'esm',
  },
  {
    file: `./dist/flowregime${CompressionPrefix}.js`,
    format: 'cjs',
  },
];

export default {
  input,
  external,
  plugins,
  output,
}
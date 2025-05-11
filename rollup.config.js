import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "bin/cli.js",
  output: {
    file: "dist/cli.js",
    format: "esm",
  },
  plugins: [nodeResolve(), commonjs(), json()],
  external: [],
};

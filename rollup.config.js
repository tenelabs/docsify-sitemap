import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "bin/cli.js",
  output: {
    file: "dist/cli.cjs",
    format: "cjs",
    exports: "auto",
  },
  plugins: [nodeResolve(), commonjs(), json()],
  external: [],
};

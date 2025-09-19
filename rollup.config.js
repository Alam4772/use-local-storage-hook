const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("rollup-plugin-typescript2");
const terser = require("@rollup/plugin-terser").default; // <-- note .default
const pkg = require("./package.json");

module.exports = {
  input: "src/index.ts",
  external: Object.keys(pkg.peerDependencies || {}),
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true, exports: "named" },
    { file: pkg.module, format: "esm", sourcemap: true },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: { exclude: ["example", "node_modules"] },
    }),
    terser(), // <-- works now
  ],
};

import { defineConfig, type Options } from "tsup"

export default defineConfig((options: Options) => ({
  // banner: {
  //   js: "'use client'",
  // },
  treeshake: true,
  splitting: true,
  // TODO: Issue could be here
  entry: ["./**/*.tsx"],
  // format: ["esm"],
  // dts: true,
  minify: true,
  clean: true,
  // TODO: Or here because this flag is used in package.json
  // external: ["react"],
  ...options
}))

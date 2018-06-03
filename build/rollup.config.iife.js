import config from "./rollup.config";

export default config({
  input: "src/browser.js",
  output: {
    file: "dist/simplytest.js",
    name: "simplytest",
    format: "iife"
  },
  browser: true
});

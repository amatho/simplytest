import config from "./rollup.config";

export default config({
    format: "iife",
    dest: "dist/simplytest.js",
    browser: true
});

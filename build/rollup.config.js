import buble from "rollup-plugin-buble";
import replace from "rollup-plugin-replace";

export default config => ({
    entry: "src/index.js",
    format: config.format,
    moduleName: "simplytest",
    dest: config.dest,
    plugins: [
        buble(),
        replace({ "process.browser": JSON.stringify(!!config.browser) })
    ]
});

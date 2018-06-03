import buble from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";

export default config => ({
    input: config.input,
    output: config.output,
    plugins: [
        replace({ "process.browser": JSON.stringify(!!config.browser) })
    ]
});

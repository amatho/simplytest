import * as output from "./web-output";
import * as core from "./core";

const start = core.start(output);
const end = core.end(output);
const test = core.test(output);
const xtest = core.xtest(output);
const group = core.group(output);

export default {
  start,
  end,
  test,
  xtest,
  group
};

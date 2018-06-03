import * as webOutput from "./web-output";

const output = process.browser ? webOutput : null;

const results = {
  total: 0,
  passed: 0,
  failed: 0
};

const evaluator = (expr, message) => {
  if (expr) return true;

  throw new Error(message);
};

const assert = a => evaluator(a,
  `assert(): '${a}' did not result in a truthy value!`);

const identical = (a, b) => evaluator(a === b,
  `identical(): '${a}' is not identical to '${b}'!`);

const nonidentical = (a, b) => evaluator(a !== b,
  `nonidentical(): '${a}' is identical to '${b}'!`);

const equal = (a, b) => evaluator(a == b,
  `equal(): '${a}' is unequal to '${b}'!`);

const unequal = (a, b) => evaluator(a != b,
  `unequal(): '${a}' is equal to '${b}'!`);

const less = (a, b) => evaluator(a < b,
  `less(): '${a}' is not less than '${b}' !`);

const greater = (a, b) => evaluator(a > b,
  `greater(): '${a}' is not greater than '${b}' !`);

const testerObject = () => ({
  assert, identical, nonidentical, equal, unequal, less, greater,

  throws: (fn, errorMsg = "") => {
    const didNotThrowError = new Error(`throws(): Function '${fn.name}' did not throw!`);

    try {
      fn();
      throw didNotThrowError;
    } catch (e) {
      if (e === didNotThrowError) throw didNotThrowError;
      if (errorMsg === "" || e.message === errorMsg) return true;

      throw new Error("throws(): The error message was unexpected!\n" +
        `\tFound: ${e.message}\n
        \tExpected: ${errorMsg}`);
    }
  },
  works: fn => {
    try {
      fn();
    } catch (e) {
      throw new Error(`works(): Function '${fn.name}' did throw!\n\tMessage: ${e.message}`);
    }
  },
  fail: () => {
    throw new Error(`fail(): Test failed!`);
  }
});

const setup = output.setup;

const end = () => {
  output.summary(results);
};

const test = (name, callback) => {
  results.total++;

  try {
    callback(testerObject());
    output.passed(name);
    results.passed++;
  } catch (e) {
    output.failed(name, e);
    console.error(name, "failed:\n", e);
    results.failed++;
  }
};

const xtest = output.disabled;

const group = (name, callback) => {
  output.group(name);

  output.indent();
  callback();
  output.unindent();
};

export {
  setup,
  test,
  xtest,
  group,
  end
};

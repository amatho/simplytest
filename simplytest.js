(function() {
    let simplytest = {};

    const results = {
        total: 0,
        passed: 0,
        failed: 0
    };

    const styleString = `
    body {
        margin: 0;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 62.5%;
    }
    #result {
        font-size: 1.2rem;
    }
    #result .item {
        padding: 8px 16px;
        margin: 8px 0;
    }
    #result .item .status {
        padding: 2px;
    }
    #result .success {
        background-color: #00ff00;
    }
    #result .fail {
        background-color: #ff0000;
        color: #ffffff;
    }
    #result .result {
        background-color: #212121;
        color: #ffffff;
    }
    #result .disabled {
        background-color: #efefef;
    }
    #result .success .status {
        background-color: #00df00;
    }
    #result .fail .status {
        background-color: #df0000;
        color: #ffffff;
    }
    #result .disabled .status {
        background-color: #cfcfcf;
    }
    .red {
        color: #ff0000;
    }
    .green {
        color: #00ff00;
    }
    .tab {
        margin-left: 2rem;
    }
    `;

    let _elementId;
    let _indentLevel = 0;
    let _groupCount = 0;

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
          } catch(e) {
              if (e === didNotThrowError) throw didNotThrowError;
              if (errorMsg === "" || e.message === errorMsg) return true;

              throw new Error("throws(): The error message was unexpected!<br>" +
                  `<span class="tab"></span>Found: ${e.message}<br>
                  <span class="tab"></span>Expected: ${errorMsg}`);
          }
      },
      works: fn => {
          try {
              fn();
          } catch(e) {
              throw new Error(`works(): Function '${fn.name}' did throw!<br><span class="tab"></span>Message: ${e.message}`);
          }
      },
      fail: () => {
          throw new Error(`fail(): Test failed!`);
      }
    });

    const writeDiv = (content, className = "", indent = _indentLevel, id = "", style = "") => {
        const groupEl = document.getElementById("group" + _groupCount);
        const prevGroupEl = document.getElementById("group" + (_groupCount - 1));
        const resultEl = document.getElementById(_elementId);
        let el;

        if (indent > 0 && groupEl !== null) {
            el = groupEl;
        } else if (indent > 0 && prevGroupEl !== null) {
            el = prevGroupEl;
        } else {
            el = resultEl;
        }

        const margin = indent * 2;
        el.innerHTML += `
        <div
            id="${id}"
            class="item ${className}"
            style="margin-left: ${margin}rem; ${style}"
        >
            ${content}
        </div>
        `;
    };

    const writeTestResult = (name, passed, errorMsg) => {
        const className = passed ? "success" : "fail";
        const status = passed ? "OK" : "FAIL";

        let failText = "";
        if (!passed) {
            failText = `<br><br>${errorMsg}<br>
            Check the JavaScript console for the stack trace.`;
        }

        const content = `
        <b><span class="status">${status}</span> &mdash; "${name}".</b>
        ${failText}
        `;

        writeDiv(content, className);
    };

    const writePassed = name => {
        writeTestResult(name, true);
    };

    const writeFailed = (name, errorMsg) => {
        writeTestResult(name, false, errorMsg);
    };

    const writeDisabled = name => {
        const content = `
        <b><span class="status">DISABLED</span> "${name}". Test is disabled.</b>
        `;

        writeDiv(content, "disabled");
    };

    const writeGroup = name => {
        const nameStr = `<b>=> "${name}" group</b>`;
        const val = 255 - (30 * (_indentLevel + 1));
        const style = `background-color: rgb(${val},${val},${val})`;
        const id = "group" + _groupCount;

        writeDiv(nameStr, "", _indentLevel, id, style);
    };

    const writeSummary = ({total = 0, passed = 0, failed = 0}) => {
        const resultEl = document.getElementById(_elementId);
        const exitStatus = failed === 0 ? "succeeded" : "failed";
        const color = failed === 0 ? "green" : "red";

        resultEl.innerHTML += `<hr>`;

        const content = `
        <b>Tests <span class="${color}">${exitStatus}</span>.</b><br><br>
        Total: ${total}. Passed: <span class="green">${passed}</span>. Failed: <span class="red">${failed}</span>.
        `;

        writeDiv(content, "result", 0);
    };

    const setup = ({style = true, createElement = true, elementId = "result"} = {}) => {
        _elementId = elementId;

        if (createElement) {
            const el = document.createElement("div");
            el.id = elementId;
            document.body.appendChild(el);
        }

        if (style) {
            const el = document.createElement("style");
            el.innerHTML = styleString;
            document.head.appendChild(el);
        }
    };

    const end = () => {
        writeSummary(results);
    };

    const test = (name, callback) => {
        results.total++;

        try {
            callback(testerObject());
            writePassed(name);
            results.passed++;
        } catch(e) {
            writeFailed(name, e);
            console.error(name, "failed:\n", e);
            results.failed++;
        }
    };

    const xtest = name => {
        writeDisabled(name);
    };

    const group = (name, callback) => {
        _groupCount++;
        writeGroup(name);

        _indentLevel++;
        callback();
        _indentLevel--;
    };

    simplytest = {
        setup,
        test,
        xtest,
        group,
        end
    };

    window.simplytest = window.simplytest || simplytest;
})();

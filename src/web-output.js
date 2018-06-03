let _parent;
let _indentLevel = 0;
let _groupCount = 0;

// #region style
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
// #endregion

const writeDiv = (
  content,
  className = "",
  indent = 0,
  id = "",
  style = ""
) => {
  const groupEl = document.getElementById("group" + _groupCount);
  const prevGroupEl = document.getElementById("group" + (_groupCount - 1));
  let el;

  if (indent > 0 && groupEl !== null) {
    el = groupEl;
  } else if (indent > 0 && prevGroupEl !== null) {
    el = prevGroupEl;
  } else {
    el = _parent;
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

const passed = name => {
  writeTestResult(name, true);
};

const failed = (name, errorMsg) => {
  writeTestResult(name, false, errorMsg);
};

const disabled = name => {
  const content = `
        <b><span class="status">DISABLED</span> "${name}". Test is disabled.</b>
        `;

  writeDiv(content, "disabled");
};

const group = name => {
  _groupCount++;
  const nameStr = `<b>=> "${name}" group</b>`;
  const val = 255 - (30 * (_indentLevel + 1));
  const style = `background-color: rgb(${val},${val},${val})`;
  const id = "group" + _groupCount;

  writeDiv(nameStr, "", _indentLevel, id, style);
};

const summary = ({ total = 0, passed = 0, failed = 0 }) => {
  const exitStatus = failed === 0 ? "succeeded" : "failed";
  const color = failed === 0 ? "green" : "red";

  _parent.innerHTML += `<hr>`;

  const content = `
        <b>Tests <span class="${color}">${exitStatus}</span>.</b><br><br>
        Total: ${total}. Passed: <span class="green">${passed}</span>. Failed: <span class="red">${failed}</span>.
        `;

  writeDiv(content, "result", 0);
};

const setup = () => {

  const el = document.createElement("div");
  el.id = "result";
  document.body.appendChild(el);
  _parent = el;

  {
    const el = document.createElement("style");
    el.innerHTML = styleString;
    document.head.appendChild(el);
  }
};

const indent = () => {
  _indentLevel++;
};

const unindent = () => {
  _indentLevel--;
};

export {
  setup,
  passed,
  failed,
  disabled,
  group,
  indent,
  unindent,
  summary
};

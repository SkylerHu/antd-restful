// import libs from "../src/index.js";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const libs = require("../dist/esm/index.js").default;

window.antdRestful = libs;

export default libs;

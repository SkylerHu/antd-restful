import React from "react";
import { ConfigProvider } from "antd";
import locale from "antd/es/locale/zh_CN";
import ReactDOM from "react-dom/client";
import { detectAntdVersion } from "../src/common/dateUtils";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

import moment from "moment";
import "moment/locale/zh-cn";

import App from "./App";

const version = detectAntdVersion();

if (version >= 5) {
  dayjs.locale("zh-cn");
} else {
  moment.locale("zh-cn");
  try {
    require("antd/dist/antd.css");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("antd/dist/antd.css not found");
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

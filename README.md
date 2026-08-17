# antd-restful

> Configuration-driven RESTful data components for Ant Design

[![NPM Version](https://img.shields.io/npm/v/antd-restful)](https://www.npmjs.com/package/antd-restful)
[![NPM Downloads](https://img.shields.io/npm/dm/antd-restful)](https://www.npmjs.com/package/antd-restful)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/antd-restful)](https://bundlephobia.com/package/antd-restful)
[![Node Version](https://img.shields.io/node/v/antd-restful)](https://www.npmjs.com/package/antd-restful)
[![Test](https://github.com/skylerhu/antd-restful/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/skylerhu/antd-restful/actions/workflows/test.yml)
[![Test antd6](https://github.com/skylerhu/antd-restful/actions/workflows/test-antd6.yml/badge.svg?branch=master)](https://github.com/skylerhu/antd-restful/actions/workflows/test-antd6.yml)
[![Codecov](https://codecov.io/gh/skylerhu/antd-restful/graph/badge.svg?token=BTKSLG8KL2)](https://codecov.io/gh/skylerhu/antd-restful)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License](https://img.shields.io/github/license/skylerhu/antd-restful)](https://github.com/skylerhu/antd-restful/blob/master/LICENSE)
[![Documentation](https://img.shields.io/badge/docs-online-blue?logo=github)](https://skylerhu.github.io/antd-restful/)
[![CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open%20in%20Sandbox-blue?style=flat&logo=codesandbox)](https://codesandbox.io/p/sandbox/github/skylerhu/antd-restful)

[English](./README.md) | [中文](./README.zh-CN.md)

---

A configuration-driven, data-oriented component library built on React + Ant Design, designed around RESTful APIs. Achieve API integration and interaction orchestration through declarative configuration — covering table & list rendering, filter form binding, pagination & sorting, bidirectional URL parameter sync, request cancellation, error handling, and more. Ideal for admin panels, operations dashboards, and dynamic JSON-driven UIs.

## Demo

<p align="center">
  <video src="https://github.com/user-attachments/assets/d22d1a71-271b-4ad7-bfe3-83ab48b83b27" autoplay loop muted playsinline width="100%"></video>
</p>

## Features

- **RESTful Table & List** — `RestTable` / `RestList` out of the box, with built-in pagination, sorting, filtering, and advanced search
- **URL Parameter Sync** — `RouteBaseTable` automatically syncs filter state with the URL bidirectionally, preserving state on refresh/share
- **Remote Selection Components** — `RestSelect` / `RestTreeSelect` / `RestCascader` for dropdown, tree, and cascading selection
- **Grid Form** — `GridForm` for unified layout and field arrangement, with rich `formitems` sub-components
- **Multi-version Compatibility** — Supports antd 4.24+ / 5.x / 6.x, auto-adapts between dayjs and moment
- **Controllable Requests** — Built on axios, supports request cancellation, error handling, and custom query serialization

## Compatibility

| Dependency | Version |
|---|---|
| antd | `>= 4.24` (including antd 5 & antd 6) |
| @ant-design/icons | `>= 4` |
| react / react-dom | `>= 16` |
| Node.js | `>= 18` |

## Installation

```bash
npm install antd-restful
```

You also need to install peer dependencies:

```bash
npm install react react-dom antd @ant-design/icons axios
```

Optional dependencies (choose based on your antd version):

```bash
# antd v5 / v6
npm install dayjs

# antd v4
npm install moment
```

## Quick Start

```jsx
import antdRestful from "antd-restful";
const { RestTable } = antdRestful;

function UserList() {
  return (
    <RestTable
      restful="/api/users/"
      columns={[{ title: "Name", dataIndex: "name" }]}
      rowKey="id"
    />
  );
}
```

ESM / CJS import styles:

```jsx
// ESM (recommended)
import antdRestful from "antd-restful";

// CommonJS
const antdRestful = require("antd-restful").default;
```

## Configuration

Components internally use `query-string` for query serialization, with default settings `{ arrayFormat: "comma", skipNull: true, skipEmptyString: true }`. Override via global config:

```jsx
import antdRestful from "antd-restful";
const { setGlobalConfig, setRestOptions } = antdRestful;

// Custom query serialization
setGlobalConfig({
    queryStringify: (params) => Qs.stringify(params, { arrayFormat: "brackets" }),
    queryParse: (string) => Qs.parse(string, { arrayFormat: "brackets" }),
});

// Custom pagination field mapping (e.g. for Django REST framework)
setRestOptions({
    fieldPage: "current",
    fieldPageSize: "pageSize",
    parseRowsPath: "data.list",
    parseTotalPath: "data.total",
});
```

`setRestOptions` defaults are aligned with Django REST framework (DRF):

| Option | Default | Description |
|---|---|---|
| `fieldPage` | `"page"` | Pagination parameter: current page field |
| `fieldPageSize` | `"page_size"` | Pagination parameter: page size field |
| `searchKey` | `"search"` | Search keyword field for list search |
| `fieldOrdering` | `"ordering"` | Sorting field |
| `parseRowsPath` | `"results"` | Object path for list data in API response (DRF default `{ count, results }`) |
| `parseTotalPath` | `"count"` | Object path for total count in API response |
| `separator` | `","` | Separator for multi-select array values |
| `defaultPageSize` | `20` | Default page size |
| `rowKey` | `"id"` | Default primary key field for list/table |
| `fieldParent` | `"parent"` | Default parent node field for tree/cascading structures |

## Components

| Component | Description |
|---|---|
| `RestTable` | Remote table with pagination, sorting, filtering, advanced search, and column settings |
| `RestList` | Remote list with card layout, pagination, and load-more support |
| `GridForm` | Grid form container for unified layout and field arrangement |
| `RouteBaseTable` | URL-synced table with shareable links and state persistence on refresh |
| `RestSelect` / `RestTreeSelect` / `RestCascader` | Remote selection components (dropdown / tree / cascading) |
| `DateStrPicker` / `RangeStrPicker` / `NumberRange` | Date range and number range inputs |
| `UploadView` | File upload with drag & drop, limits, and read-only preview |
| `CompareEdit` | Historical value comparison editor showing change diffs |

For the full API documentation, visit the **[Online Docs](https://skylerhu.github.io/antd-restful/)**.

## Examples

- [RESTful Table Data Display](./demo/views/TableDemo.jsx)
- [RESTful List Data Display](./demo/views/ListDemo.jsx)
- [Dynamic JSON Form](./demo/views/JSONForm.jsx)
- [Route Parameter Sync RouteTable](./demo/views/RouteTable.jsx)

## FAQ

See [Frequently Asked Questions](./docs/site/faq/index.md).

## Contributing

Contributions welcome! Please read the [Contributing Guide](./docs/CONTRIBUTING.md) before submitting a PR.

## Changelog

See [Changelog](./docs/site/changelog/index.md).

## License

[MIT](./LICENSE) © [SkylerHu](https://github.com/skylerhu)

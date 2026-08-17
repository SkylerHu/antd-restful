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

基于 React + Ant Design，围绕 RESTful 接口封装的配置化数据驱动组件库。通过声明式配置即可完成接口对接与交互编排，覆盖表格与列表展示、筛选表单联动、分页排序、路由参数双向同步、请求取消与错误提示等高频能力，适合后台管理、运营系统与动态 JSON 配置场景。

## Demo

<p align="center">
  <video src="https://github.com/user-attachments/assets/d22d1a71-271b-4ad7-bfe3-83ab48b83b27" autoplay loop muted playsinline width="100%"></video>
</p>

## Features

- **RESTful 表格 & 列表** — `RestTable` / `RestList` 开箱即用，内置分页、排序、筛选、高级搜索
- **路由参数同步** — `RouteBaseTable` 自动将筛选状态与 URL 双向绑定，刷新/分享不丢状态
- **远程选择组件** — `RestSelect` / `RestTreeSelect` / `RestCascader` 覆盖下拉、树形、级联选择
- **栅格表单** — `GridForm` 统一布局与字段编排，搭配丰富的 formitems 子组件
- **多版本兼容** — 同时支持 antd 4.24+ / 5.x / 6.x，自动适配 dayjs 与 moment
- **请求可控** — 基于 axios，支持请求取消、错误提示、query 序列化自定义

## Compatibility

| Dependency | Version |
|---|---|
| antd | `>= 4.24`（含 antd 5 & antd 6） |
| @ant-design/icons | `>= 4` |
| react / react-dom | `>= 16` |
| Node.js | `>= 18` |

## Installation

```bash
npm install antd-restful
```

还需要安装 peer dependencies：

```bash
npm install react react-dom antd @ant-design/icons axios
```

可选依赖（按 antd 版本选择安装其一）：

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
      columns={[{ title: "名称", dataIndex: "name" }]}
      rowKey="id"
    />
  );
}
```

ESM / CJS 导入方式：

```jsx
// ESM（推荐）
import antdRestful from "antd-restful";

// CommonJS
const antdRestful = require("antd-restful").default;
```

## Configuration

组件内部使用 `query-string` 进行 query 序列化，默认设置为 `{ arrayFormat: "comma", skipNull: true, skipEmptyString: true }`。可通过全局配置覆盖：

```jsx
import antdRestful from "antd-restful";
const { setGlobalConfig, setRestOptions } = antdRestful;

// 自定义 query 序列化
setGlobalConfig({
    queryStringify: (params) => Qs.stringify(params, { arrayFormat: "brackets" }),
    queryParse: (string) => Qs.parse(string, { arrayFormat: "brackets" }),
});

// 自定义分页字段映射（对照后端接口，如 Django REST framework）
setRestOptions({
    fieldPage: "current",
    fieldPageSize: "pageSize",
    parseRowsPath: "data.list",
    parseTotalPath: "data.total",
});
```

`setRestOptions` 默认值对照 Django REST framework (DRF) 的默认行为：

| 配置项 | 默认值 | 说明 |
|---|---|---|
| `fieldPage` | `"page"` | 分页请求参数：当前页码字段 |
| `fieldPageSize` | `"page_size"` | 分页请求参数：每页数量字段 |
| `searchKey` | `"search"` | 列表检索的搜索关键字字段 |
| `fieldOrdering` | `"ordering"` | 排序字段 |
| `parseRowsPath` | `"results"` | 接口返回列表数据所在的对象路径（DRF 默认 `{ count, results }`) |
| `parseTotalPath` | `"count"` | 接口返回总条数所在的对象路径 |
| `separator` | `","` | 数组元素多选时的连接符 |
| `defaultPageSize` | `20` | 默认的分页大小 |
| `rowKey` | `"id"` | 列表/表格的默认主键字段 |
| `fieldParent` | `"parent"` | 树形或级联结构默认的父节点字段 |

## Components

| Component | Description |
|---|---|
| `RestTable` | 远程表格，支持分页、排序、筛选、高级搜索、列设置 |
| `RestList` | 远程列表，支持卡片流、分页与加载更多 |
| `GridForm` | 栅格表单容器，统一布局与字段编排 |
| `RouteBaseTable` | URL 参数联动表格，支持可分享链接与刷新保留状态 |
| `RestSelect` / `RestTreeSelect` / `RestCascader` | 远程选择类组件（下拉 / 树形 / 级联） |
| `DateStrPicker` / `RangeStrPicker` / `NumberRange` | 时间范围与数值区间输入 |
| `UploadView` | 文件上传，支持拖拽、限制、只读回显 |
| `CompareEdit` | 历史值对比编辑，展示变更差异 |

完整 API 文档请访问 **[在线文档](https://skylerhu.github.io/antd-restful/)**。

## Examples

- [RESTful 表格数据展示](./demo/views/TableDemo.jsx)
- [RESTful 列表数据展示](./demo/views/ListDemo.jsx)
- [动态 JSON 表单](./demo/views/JSONForm.jsx)
- [路由参数同步 RouteTable](./demo/views/RouteTable.jsx)

## FAQ

查看 [常见问题说明](./docs/site/faq/index.md)。

## Contributing

欢迎贡献！提交 PR 前请阅读 [贡献指南](./docs/CONTRIBUTING.md)。

## Changelog

查看 [更新日志](./docs/site/changelog/index.md)。

## License

[MIT](./LICENSE) © [SkylerHu](https://github.com/skylerhu)

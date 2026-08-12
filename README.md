# antd-restful

[![NPM Version](https://img.shields.io/npm/v/antd-restful)](https://www.npmjs.com/package/antd-restful)
[![GitHub Actions Workflow Status](https://github.com/skylerhu/antd-restful/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/skylerhu/antd-restful)
[![Codecov](https://img.shields.io/codecov/c/github/skylerhu/antd-restful?branch=master)](https://app.codecov.io/github/skylerhu/antd-restful)
[![GitHub License](https://img.shields.io/github/license/skylerhu/antd-restful)](https://github.com/skylerhu/antd-restful)
[![CodeSandbox](https://img.shields.io/badge/CodeSandbox-Open%20in%20Sandbox-blue?style=flat&logo=codesandbox)](https://codesandbox.io/p/sandbox/github/skylerhu/antd-restful)

#### 面向 Ant Design 的配置化 RESTful 数据组件库

该库基于 React + Ant Design，围绕 RESTful 接口封装了开箱即用的数据驱动组件体系，覆盖表格与列表展示、筛选表单联动、分页排序、路由参数双向同步、请求取消与错误提示等高频能力。通过声明式配置即可完成接口对接与交互编排，并提供字段解析、格式化、校验及多种表单子组件，兼顾 antd4/5/6 时间库与组件 API 差异，适合后台管理、运营系统与动态 JSON 配置场景。

当前版本兼容范围：

- `antd >= 4.24`（已覆盖 antd5 与 antd6 测试流程）
- `@ant-design/icons >= 4`
- `react/react-dom >= 16`

#### demo演示

<p align="center">
  <video src="https://github.com/user-attachments/assets/d22d1a71-271b-4ad7-bfe3-83ab48b83b27" autoplay loop muted playsinline width="100%"></video>
</p>



## 一. 安装

```
npm install antd-restful
```

还需要安装库自身的依赖：

```
npm install react react-dom antd @ant-design/icons axios
```

可选依赖（按 `antd` 版本选择安装，建议安装其一）：

```
# antd v5/v6 推荐
npm install dayjs

# antd v4 推荐
npm install moment
```

使用示例：

```jsx
// 推荐：ESM 默认导入
import antdRestful from "antd-restful";

const {
  GridForm, RestTable,
  request,
  formitems: { RestSelect },
  apiTools: { useSafeRequest },
  constants: { FieldType },
  typeTools: { isEmpty },
} = antdRestful;
```

若在 CommonJS 环境（`require`）下使用：

```js
const antdRestful = require("antd-restful").default;
```

最常见的用法——直接在 `RestTable` 中配置 `restful`：

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

## 二. 使用(Usage)

需要注意的是：组件中远程请求，内部关于 `query` 序列化的处理，使用的是 `query-string` 库，设置了 `{ arrayFormat: "comma", skipNull: true, skipEmptyString: true }` 等参数。

若是需要调整请求参数的序列化，或者 DRF 相关的默认配置字段，可以在入口中修改：

```jsx
import antdRestful from "antd-restful";

const { setGlobalConfig, setRestOptions } = antdRestful;

// 修改 query-string 的序列化/反序列化处理方式
setGlobalConfig({
    queryStringify: (params) => Qs.stringify(params, {arrayFormat: 'brackets'}),
    queryParse: (string) => Qs.parse(string, {arrayFormat: 'brackets'}),
});

// 修改组件相关的默认请求参数（如分页参数等），主要对照后端接口（如 Django REST framework 等）
setRestOptions({
    fieldPage: "current",          // 默认是 "page"
    fieldPageSize: "pageSize",     // 默认是 "page_size"
    parseRowsPath: "data.list",    // 默认是 "results"
    parseTotalPath: "data.total",  // 默认是 "count"
});
```

常见组件说明（简要）：

- RestTable：远程表格组件，支持分页、排序、筛选、高级搜索、列设置等常见后台表格能力。
- RestList：远程列表组件，适合卡片流或信息列表展示，支持分页与加载更多模式。
- GridForm：栅格表单容器，负责统一布局与字段编排，可配合各类 formitems 使用。
- RouteBaseTable：将筛选状态与 URL 参数联动，适合需要可分享链接和刷新保留状态的页面。
- RestSelect / RestTreeSelect / RestCascader：远程选择类组件，覆盖下拉、树形和级联选择场景。
- DateStrPicker / RangeStrPicker / NumberRange：常用范围输入组件，适合时间范围、日期范围与数值区间筛选。
- UploadView：文件上传组件，支持拖拽、大小/数量限制、只读回显与上传结果处理。
- CompareEdit：历史值对比编辑组件，用于展示变更前后差异并支持只读对比视图。

更多组件能力、表单项示例、工具函数与完整 API，请访问在线文档：

- [https://skylerhu.github.io/antd-restful/](https://skylerhu.github.io/antd-restful/)

## 三、应用场景

- [依赖restful接口的表格数据展示](./demo/views/TableDemo.jsx)
- [依赖restful接口的列表数据展示](./demo/views/ListDemo.jsx)
- [动态表单中的应用](./demo/views/JSONForm.jsx)
- [支持路由参数同步的 RouteTable 表格应用](./demo/views/RouteTable.jsx)

## 四、常见问题 (FAQ)

- [查看常见问题说明](./docs/site/faq/index.md)


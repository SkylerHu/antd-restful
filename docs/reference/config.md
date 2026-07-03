# 全局配置 (Global Configuration)

`antd-restful` 提供了一套灵活的全局配置方案，用于对接后端（如 Django REST Framework）的接口字段习惯，以及处理 URL 查询参数的序列化方式。

通过统一调整全局配置，您可以避免在每次使用 `RestTable`、`RestList` 或各种表单组件时重复书写相同的属性配置。

## `restOptions`

针对请求和数据解析的通用字段配置。默认配置如下：

```javascript
export const restOptions = {
  // 分页请求参数: 当前页码字段
  fieldPage: "page",
  // 分页请求参数: 每页数量字段
  fieldPageSize: "page_size",
  // 列表检索的搜索关键字字段
  searchKey: "search",
  // 排序字段
  fieldOrdering: "ordering",
  // 接口返回列表数据所在的对象路径 (DRF 默认返回 { count: 0, results: [] })
  parseRowsPath: "results",
  // 接口返回总条数所在的对象路径
  parseTotalPath: "count",
  // 数组元素多选时的连接符
  separator: ",",
  // 默认的分页大小
  defaultPageSize: 20,
  // 列表/表格的默认主键字段
  rowKey: "id",
  // 树形或级联结构默认的父节点字段
  fieldParent: "parent",
};
```

### `setRestOptions(options)`

动态更新上述的默认项。更新后，如果某个组件因 state 改变发生重绘（或新挂载），且并未显式传入该属性，则会自动读取最新的 `restOptions`。

**使用示例：**

```javascript
import { setRestOptions } from "antd-restful";

// 对接非 DRF 风格的后端服务（例如 Java 或 Spring Boot 自定义封装）
setRestOptions({
  fieldPage: "current",            // 将当前页参数名改为 current
  fieldPageSize: "size",           // 将页面大小参数名改为 size
  parseRowsPath: "data.records",   // 列表数据所在路径为 data.records
  parseTotalPath: "data.total",    // 总数数据所在路径为 data.total
  rowKey: "uuid",                  // 主键更改为 uuid
});
```

## `globalConfig`

用于管理更底层的序列化和反序列化等工具方法的配置。

```javascript
const globalConfig = {
  // URL 查询参数的序列化方法
  queryStringify: (params, options) => queryString.stringify(params, options),
  // URL 查询参数的反序列化方法
  queryParse: (params, options) => queryString.parse(params, options),
};
```

### `setGlobalConfig(config)`

当您需要调整网络请求过程中的数组或对象序列化格式时（默认使用 `query-string` 的能力），可以通过覆盖这两种方法来适配后端的解析能力。

**使用示例：**

```javascript
import { setGlobalConfig } from "antd-restful";
import Qs from "qs";

// 替换为 qs 库并指定数组以方括号格式传递
// 例如：ids[]=1&ids[]=2
setGlobalConfig({
  queryStringify: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
  queryParse: (string) => Qs.parse(string, { arrayFormat: 'brackets' }),
});
```

---

> **注意：** 建议将 `setRestOptions` 和 `setGlobalConfig` 放在您 React 应用的最顶层入口文件（如 `src/index.js` 或 `src/App.js` 的开头位置）统一执行一次，以确保对所有组件稳定生效。


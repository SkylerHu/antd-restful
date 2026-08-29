#  面向 Ant Design 的配置化 RESTful 数据组件库

该库基于 React + Ant Design，围绕 RESTful 接口封装了开箱即用的数据驱动组件体系，覆盖表格与列表展示、筛选表单联动、分页排序、路由参数双向同步、请求取消与错误提示等高频能力。通过声明式配置即可完成接口对接与交互编排，并提供字段解析、格式化、校验及多种表单子组件，兼顾 antd4/5/6 时间库与组件 API 差异，适合后台管理、运营系统与动态 JSON 配置场景。

## 核心能力

- 开箱即用的 RESTful 数据组件：`RestTable`、`RestList`、`RouteBaseTable`
- 配置化筛选与表单联动：`GridForm` + 多种 `formitems`
- 支持分页、排序、筛选、路由参数双向同步
- 内置请求封装、请求取消、错误处理与工具函数
- 兼容 antd4/5/6 的常见差异化使用场景

## 兼容性

- `antd >= 4.24`（已覆盖 antd5 与 antd6 测试流程）
- `@ant-design/icons >= 4`
- `react/react-dom >= 16`

## 安装

```bash
npm install antd-restful
npm install react react-dom antd @ant-design/icons axios
```

可选时间库依赖（按 `antd` 版本选择其一）：

```bash
# antd v5/v6 推荐
npm install dayjs

# antd v4 推荐
npm install moment
```

如果你的项目使用 Node 12 等低版本环境，可安装 `0.x` 兼容版本：

```bash
npm install antd-restful@compat
# 或指定具体版本
npm install antd-restful@0.5.0
```

兼容版本的导入方式略有不同：

```js
import * as antdRestful from "antd-restful";
```

## 快速开始

```jsx | pure
import antdRestful from "antd-restful";

const { RestTable } = antdRestful;

export default function UserList() {
  return (
    <RestTable
      restful="https://dummyjson.com/users"
      parseRowsPath="users"
      parseTotalPath="total"
      fieldPage="skip"
      fieldPageSize="limit"
      baseParams={{ limit: 10 }}
      columns={[{ title: "姓名", dataIndex: "firstName" }]}
      rowKey="id"
    />
  );
}
```

> 如果你的后端是 Django REST framework（默认 `results/count/page/page_size`），可省略上述解析配置；
> 如果是其他返回结构，请按接口格式设置 `parseRowsPath`、`parseTotalPath` 和分页字段映射。

## 文档导航

### 首页

- [首页（当前）](./index.zh-CN.md)

### 组件

- [组件总览](./components/overview.zh-CN.md)
- [RouteBaseTable](./components/route-base-table.zh-CN.md)
- [RestTable](./components/rest-table.zh-CN.md)
- [RestList](./components/rest-list.zh-CN.md)
- [GridForm](./components/grid-form.zh-CN.md)
- [LongText](./components/long-text.zh-CN.md)
- [CopyView](./components/copy-view.zh-CN.md)

### 表单项

- [表单项总览](./formitems/overview.zh-CN.md)
- [RestSelect](./formitems/rest-select.zh-CN.md)
- [TableSelect](./formitems/table-select.zh-CN.md)
- [RestAutoComplete](./formitems/rest-auto-complete.zh-CN.md)
- [RestCascader](./formitems/rest-cascader.zh-CN.md)
- [RestTreeSelect](./formitems/rest-tree-select.zh-CN.md)
- [UploadView](./formitems/upload-view.zh-CN.md)
- [DateStrPicker](./formitems/date-str-picker.zh-CN.md)
- [RangeStrPicker](./formitems/range-str-picker.zh-CN.md)
- [ExpansionView](./formitems/expansion-view.zh-CN.md)
- [NumberRange](./formitems/number-range.zh-CN.md)
- [CompareEdit](./formitems/compare-edit.zh-CN.md)
- [MentionView](./formitems/mention-view.zh-CN.md)

### 工具与 Hooks

- [工具总览](./tools/overview.zh-CN.md)
- [配置](./tools/config.zh-CN.md)
- [请求模块](./tools/requests.zh-CN.md)
- [Hooks](./tools/hooks.zh-CN.md)
- [类型工具](./tools/type-tools.zh-CN.md)
- [校验器](./tools/validators.zh-CN.md)

### 其他

- [FAQ](./faq/index.zh-CN.md)
- [更新日志](./changelog/index.zh-CN.md)
- [GitHub 仓库](https://github.com/skylerhu/antd-restful)

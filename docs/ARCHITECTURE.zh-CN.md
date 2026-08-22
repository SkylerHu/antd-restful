# 架构文档

[English](./ARCHITECTURE.md) | 中文文档

## 背景与动机

在典型的后台管理和运营系统中，80% 的页面遵循相同的模式：从 RESTful API 获取数据、在表格或列表中展示、提供筛选、分页和排序功能。开发者不断重复编写样板代码 —— 封装 axios 调用、管理 loading 状态、同步 URL 参数、处理分页计算、协调筛选表单与表格刷新。

**antd-restful** 的诞生就是为了消除这些样板代码。开发者不再需要命令式地编排数据获取和 UI 更新，只需声明*展示什么*和*从哪里获取*，库来处理其余的事情：请求生命周期、参数管理、错误处理和 Ant Design 组件集成。

### 目标场景

- **后台管理系统**：需要大量 CRUD 列表页面
- **运营看板**：需要通过 URL 分享和收藏筛选状态
- **动态 JSON 驱动的 UI**：页面结构由配置而非代码定义
- **多团队协作项目**：统一的模式降低上手成本

## 设计理念

### 1. 配置优先于编码

核心原则是**声明式配置**。一个带有 `restful` URL 和 `columns` 数组的 `RestTable` 就能生成一个完整功能的数据表格 —— 不需要 `useEffect`、不需要 `useState`、不需要手动 `axios.get()`。在所有可能的地方，配置对象取代了命令式代码。

### 2. 合理的默认值，完全可覆盖

默认值对齐 **Django REST framework (DRF)** 的约定（`page`/`page_size`/`results`/`count`），因为 DRF 是最常见的 REST API 模式之一。每个默认值都可以通过 `setRestOptions`（全局）或组件 props 覆盖 —— 库可以适配任何后端。

### 3. 组合而非继承

组件通过 props 和 children 组合，而非深层的类继承体系。`RouteBaseTable` 包裹 `RestTable`/`RestList`，`GridForm` 包裹标准的 antd `Form`，表单项如 `RestSelect` 以远程数据能力扩展 antd 的 `Select`。每个组件添加一层薄封装，同时将渲染委托给 Ant Design。

### 4. 对 Ant Design 内部零锁定

库将 Ant Design 视为**渲染层**。`antdTableProps`、`antdSpaceProps`、`antdFieldProps` 等 props 提供了对底层 antd 组件的透明透传。这确保了任何 antd 特性 —— 包括未来的特性 —— 无需等待库更新即可使用。

### 5. 跨版本韧性

同时支持 antd 4.24+、5.x 和 6.x 意味着要处理 API 差异（例如 `Space` 上的 `direction` vs. `orientation`、`dayjs` vs. `moment`、废弃的 props）。集中式的 `versionUtil` 模块在运行时检测 antd 主版本号，组件据此分支行为。

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                        业务应用层                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────┐       │
│  │                配置层                              │       │
│  │  setRestOptions · setGlobalConfig · setTextOptions│       │
│  └──────────────┬───────────────────────────────────┘       │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────┐       │
│  │                组件层                              │       │
│  │                                                   │       │
│  │  ┌─────────────────┐  ┌────────────────────┐    │       │
│  │  │  RouteBaseTable  │  │     GridForm       │    │       │
│  │  │  (URL 同步)      │  │  (筛选表单)         │    │       │
│  │  └───────┬──────────┘  └────────┬───────────┘    │       │
│  │          │                      │                 │       │
│  │  ┌───────▼──────────────────────▼───────────┐    │       │
│  │  │         RestTable / RestList              │    │       │
│  │  │  (数据获取 + 渲染 + 分页)                  │    │       │
│  │  └───────┬──────────────────────┬────────────┘    │       │
│  │          │                      │                 │       │
│  │  ┌───────▼────────┐  ┌─────────▼──────────┐     │       │
│  │  │   表单项组件     │  │  展示辅助组件       │     │       │
│  │  │  RestSelect    │  │  LongText           │     │       │
│  │  │  RestCascader  │  │  CopyView           │     │       │
│  │  │  UploadView    │  │  CompareEdit        │     │       │
│  │  │  ...           │  │                     │     │       │
│  │  └────────────────┘  └─────────────────────┘     │       │
│  └──────────────────────────────────────────────────┘       │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────┐       │
│  │                基础设施层                          │       │
│  │                                                   │       │
│  │  requests.jsx    hooks/     common/               │       │
│  │  (axios +        (useInterval,  (parser,           │       │
│  │   安全请求         useStorage,    typeTools,         │       │
│  │   + 取消)          useProtect)    formatter,         │       │
│  │                                  constants,         │       │
│  │                                  versionUtil)       │       │
│  └──────────────────────────────────────────────────┘       │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────┐       │
│  │                外部依赖                            │       │
│  │  axios · query-string · object-path · dequal      │       │
│  │  Ant Design · React                               │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## 目录结构

```
src/
├── index.js              # CJS 入口（从 entry.js 重新导出）
├── entry.js              # 所有组件、工具、hooks 的命名导出
├── config.js             # 全局配置：restOptions, globalConfig, textOptions
├── requests.jsx          # Axios 实例、拦截器、AbortablePromise、useSafeRequest
│
├── common/               # 纯工具函数（无 React 依赖）
│   ├── constants.js      # 枚举：FieldType, SorterEnum, ViewType, FilterType
│   ├── typeTools.js      # 类型判断：isNull, isBlank, isEmpty, isNumber 等
│   ├── parser.js         # 数据解析：query-string 封装、排序转换、树形工具
│   ├── formatter.js      # 数字/流量/百分比格式化
│   ├── sorter.js         # 本地排序和筛选逻辑
│   ├── dateUtils.js      # dayjs/moment 适配器
│   ├── treeUtils.js      # 树形数据转换
│   ├── validators.js     # 表单校验器：扩展、远程、范围
│   └── versionUtil.js    # Ant Design 主版本检测
│
├── hooks/                # React Hooks
│   ├── index.jsx         # 重新导出
│   ├── base.jsx          # useDeepCompareMemoize, useDictState
│   ├── protect.jsx       # useProtect（防止卸载后回调执行）
│   ├── interval.jsx      # useInterval（可暂停定时器）
│   └── storage.jsx       # useLocalStorage, useSessionStorage, useSettingsStorage
│
└── components/           # React 组件
    ├── RestTable.jsx      # 核心 RESTful 表格
    ├── RestList.jsx       # 核心 RESTful 列表
    ├── RouteBaseTable.jsx # URL 同步包装器
    ├── GridForm.jsx       # 配置化筛选表单
    ├── FieldsSetting.jsx  # 列显示设置（localStorage 持久化）
    ├── LongText.jsx       # 长文本截断展示
    ├── CopyView.jsx       # 一键复制
    └── formitems/         # 表单级子组件
        ├── index.js
        ├── RestSelect.jsx
        ├── TableSelect.jsx
        ├── RestAutoComplete.jsx
        ├── RestCascader.jsx
        ├── RestTreeSelect.jsx
        ├── UploadView.jsx
        ├── DateStrPicker.jsx
        ├── RangeStrPicker.jsx
        ├── ExpansionView.jsx
        ├── NumberRange.jsx
        ├── CompareEdit.jsx
        └── MentionView.jsx
```

## 核心概念

### 请求生命周期

每个数据获取组件遵循相同的生命周期：

1. **参数组装** — 合并 `baseParams`、表单筛选、路由参数、分页、排序和 `forceParams` 为一个查询对象。
2. **请求派发** — 通过共享的 axios 实例（`requests.jsx`）发送，自动附加 CSRF token 并通过 `query-string` 序列化参数。
3. **请求取消** — 每次新请求通过 `AbortController` 取消前一个请求。`AbortablePromise` 包装器确保已卸载的组件不会触发状态更新。
4. **响应解析** — 通过可配置的路径（`parseRowsPath` / `parseTotalPath`）从响应中提取行数据和总数。
5. **状态更新** — 更新内部状态，触发 antd 的 `Table` 或 `List` 重新渲染。

### 安全请求（`makeSafeRequest`）

`makeSafeRequest` 工厂函数创建一个带作用域的请求管理器，具备：

- **自动取消**：使用相同 key 重新请求会取消正在进行的请求。
- **防抖**：可选的 `delay` 参数批量处理快速连发的请求（适用于边输入边搜索）。
- **卸载清理**：`makeRequest.unmount()` 中止所有待处理的请求，在 `useSafeRequest` 的 `useEffect` 清理函数中自动调用。

### 参数优先级

参数按照明确的优先级链合并（后者覆盖前者）：

```
baseParams < routeParams < formFilters < pagination/sorting < forceParams
```

`forceParams` 始终具有最高优先级，适用于租户隔离或功能开关场景。

### 配置层级

| 层级 | 作用范围 | API |
|---|---|---|
| **全局配置** | query 序列化、文案标签 | `setGlobalConfig()`、`setTextOptions()` |
| **REST 选项** | 分页字段、响应路径、默认值 | `setRestOptions()` |
| **组件 Props** | 单实例覆盖 | `fieldPage`、`parseRowsPath` 等 |

组件 Props 覆盖 REST 选项，REST 选项覆盖全局默认值。

### URL 同步（`RouteBaseTable`）

`RouteBaseTable` 将组件状态与浏览器 URL 桥接：

1. 挂载时，解析当前 URL 的 query string 为初始筛选值。
2. 筛选变化时，调用 `onSearchChange` 更新 URL（通过消费方的路由器）。
3. 通过 `guessQueryTypes` 从列/字段定义自动推断 query 参数类型（数字 vs 字符串），避免手动类型标注。
4. 支持 `viewType` 在表格和列表视图之间切换，状态持久化到 URL。

## 组件层级关系

### 数据组件

```
RouteBaseTable
  ├── RestTable (viewType="table")
  │     ├── GridForm (filterFormProps)
  │     ├── FieldsSetting (列显示设置)
  │     └── Ant Design Table
  │
  └── RestList (viewType="list")
        ├── GridForm (filterFormProps)
        └── Ant Design List
```

### 表单项

所有表单项遵循**受控组件**模式（`value` + `onChange`），与 `Form.Item` 兼容。共享能力：

- **远程数据加载**：`restful` + `searchKey` + `parseRowsPath` + `fieldNames`
- **只读模式**：`readOnly` prop 渲染静态展示而非输入控件
- **标签模板**：`labelTemplate` 支持 `{field}` 占位符组合标签
- **复制支持**：`enableCopy` 为多选组件添加复制按钮

## 跨版本兼容

`versionUtil` 模块导出：

- `antdMajorVersion` — 检测到的 antd 主版本号（4、5 或 6）
- `isAntd5Plus` / `isAntd6Plus` — 布尔值标志

组件据此处理差异：

| 差异点 | antd 4 | antd 5+ | antd 6+ |
|---|---|---|---|
| 日期库 | `moment` | `dayjs` | `dayjs` |
| Space 布局属性 | `direction` | `direction` | `orientation` |
| Tabs 销毁属性 | `destroyInactiveTabPane` | `destroyInactiveTabPane` | `destroyOnHidden` |

`dateUtils` 模块封装了日期创建/格式化，自动适配已安装的日期库。

## 构建与分发

通过 **father** 构建两种目标产物：

| 产物 | 格式 | 路径 | 适用场景 |
|---|---|---|---|
| ESM | ES Modules | `dist/esm/` | 现代打包工具（Vite, webpack 5 等） |
| CJS | CommonJS | `dist/cjs/` | Node.js，老版打包工具 |

两者都是 **bundless** 转译 —— 依赖保留为外部 `import`/`require` 语句，不会被内联。这保持了包体积最小化，避免与消费方的依赖树产生版本冲突。

另有独立的**兼容版本**构建（`0.x`），面向 Node 12 环境，通过 webpack 生成单一 UMD 文件并内联所有依赖。

## 文档

文档使用 [dumi v2](https://d.umijs.org/) 构建，支持国际化：

- **英文**（默认）：`docs/site/*.md`
- **中文**：`docs/site/*.zh-CN.md`
- **在线示例**：使用 `jsx` 语言标签的代码块会渲染为可交互示例
- **API 表格**：以 markdown 编写，使用 dumi 默认主题样式

部署目标：GitHub Pages `https://skylerhu.github.io/antd-restful/`。

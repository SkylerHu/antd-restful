# Changelog (0.x)

## 0.5.1 - 2026-08-11

### Changed

- 同步主线 `1.0.4` 变更：`CompareEdit` 新增 `getValueFromEvent`/`valuePropName` 属性，自动兼容 antd 原生组件 `onChange` 差异。

### Notes

- 功能与主线版本 `1.0.4` 保持一致。

---

## 0.5.0 - 2026-08-10

### Added

- 首个兼容发布版本，通过 webpack 将所有依赖打包为 UMD 单文件（`compat/dist/index.js`），确保在 Node 12 / npm 6 环境下可直接使用。
- 独立的 `compat/package.json`，声明 `peerDependencies`（react、antd、axios 等）与 `peerDependenciesMeta`（dayjs、moment 可选）。
- 消费方通过 `npm install antd-restful@compat` 或 `npm install antd-restful@0.5.0` 安装。
- 导入方式：`import * as antdRestful from "antd-restful"`。

### Notes

- 功能与主线版本 `1.0.3` 保持一致。
- 后续 `0.x` 版本仅回移必要的 bugfix。

---

## 0.4.0

### Added

- 将零散的常量默认值重构为统一的全局配置，支持调用入口处动态更新修改。
  - 在 `src/config.js` 中新增并独立导出 `restOptions` 对象（包含 `fieldPage`、`parseRowsPath`、`fieldParent`、`rowKey` 等对照 DRF 习惯的默认配置），并提供配套的 `setRestOptions` 方法。
  - 移除了原 `constants.js` 中的默认值（如 `DEFAULT_PAGE_SIZE` 等），`RestList`、`RestTable` 等列表与表单组件将直接从 `restOptions` 中动态获取默认配置。
  - 在包入口 `src/entry.js` 统一暴露了 `globalConfig`、`setGlobalConfig`、`restOptions` 及 `setRestOptions`。

### Fixed

- 修复包入口 `src/entry.js` 漏导出 `setGlobalConfig` 导致外部无法进行全局配置（如设置 `queryStringify`）的致命问题。
- `RestList` / `RestTable` 首次加载时可能多次触发 onChange 请求的问题。
- `RestList` / `RestTable` 开启 `restful` 选项后，组件初始化渲染时 loading 初始化异常的问题，现已正确初始化。
- `RestList` / `RestTable` 分页组件的 `pageSize` 和 `current` 修复因为闭包引用导致的可能未及时更新显示的问题。
- `RestTable` 删除内部的 `<Table loading={loading} />` 传参，避免和上层注入冲突或无法覆盖的问题。
- 修复 `RestList` `pageSize` 参数依赖问题导致偶发抛出布局不对齐警告。
- `demo` 工程兼容 antd v5 和 v4 不同版本依赖的时间库差异（dayjs vs moment），并在 v4 环境下补充加载 antd 样式文件。

---

## 0.3.2

### Added

- `RestSelect` 新增 `fieldPageSize` 参数，初始化详情请求时自动将 `page_size` 设为待查询值的数量，确保一次请求获取所有对应 options。

### Changed

- `RouteTable` demo 组件重构，使用 `forwardRef` 支持 ref 转发，新增 `viewType` 参数支持视图切换。

### Docs

- 更新 `RouteBaseTable` 使用文档，示例与 demo 代码保持一致。

---

## 0.3.1

### Added

- `UploadView` 新增 `preserveResponse` 参数，支持在文件对象中保留服务端返回的完整 `response` 数据。

### Fixed

- `UploadView` 上传失败时增加 `console.error` 错误日志输出，便于排查问题。
- `RestList` 延迟 `grid.column` 整除校验，等待 filters 初始化完成后再检测，避免使用默认 pageSize 提前误报。

---

## 0.3.0

### Added

- 新增 `RestList` 组件，基于 Ant Design List 封装，支持远程数据加载。
  - 支持 loadMore（加载更多）和 pagination（分页器）两种模式，pagination 优先级高于 loadMore
  - 支持 filterFormProps 筛选表单，渲染在 List header 中
  - 支持 grid 栅格布局，并校验 page_size 与 grid.column 的倍数关系（不满足时 console.error）
  - renderItem 直接暴露，不封装 List.Item；提供 `RestList.Item` 等同于 `List.Item`
- 新增 `ViewType` 枚举（`constants.ViewType`），包含 TABLE 和 LIST 两个值。
- `RouteBaseTable` 新增 `viewType` 参数，支持通过 `ViewType.LIST` 切换为 RestList 渲染。
  - viewType="list" 推荐与 pagination 配合使用，不推荐与 loadMore 结合

### Docs

- 优化组件使用说明文档。

---

## 0.2.4

### Fixed

- 调整 `GridFrom` 对于隐藏的字段使用 `<Form.item hidden/>` 处理，并非完全过滤不处理。

---

## 0.2.3

### Fixed

- 修复 FieldsSettings 若设置的label是node类型，dequal对比会报错的问题。
  - 不是必现，主要出现在 value 频繁变更的场景下
- 修复 GridForm 未配置表单项时调用 form.setFieldsValue 方法出现warning问题。
  - Warning: Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?
  - 因为未配置表单项时 Form 不会渲染

---

## 0.2.2

### Fixed

- 修复 RestTable 设置隐藏列不生效问题。
  - 未将 columns 中配置的 `hidden: True` 在手动设置后 未设置为 `False`

---

## 0.2.1

### Fixed

- 调整 `useSettingsStorage`: 当字段配置列发生变化时，之前手动配置的显示字段依然生效。

---

## 0.2.0

### Changed

- 优化 RestTable 和 RouteBaseTable 处理路由参数。
  - 升级 query-string@9, `parseOptions` 支持通过 `types` 配置字段类型（连带打包无需额外安装）
  - 默认会根据 `columns` 或是 `filterFormProps.fields` 的配置类型初始化 `types`

### Fixed

- 统一 `NumberRange` 和 `RangeStrPicker` 默认值的处理，并提供 `defaultEmptyValue` 配置单项的默认值。
- `parser.queryString` 使用 `query-sting` 默认参数中去掉了 `{skipNull:true, skipEmptyString: true}`。
  - 为了解决 Range 组件有null值的场景，例如 [null, 1] 需要处理成 ",1"
  - 会在 RestTable 组件中自行调用 `clearEmptyValue` 处理远程请求时去掉空值
- 修复 RangeStrPicker 在 antd>=5 版本场景下，dayjs 未正确处理 format 的问题。
- 修复 `typeTools.isNumber` 判断问题，`""` 不是数值。

---

## 0.1.18

### Fixed

- 修复 RestTable 表单值在路由参数变更时频繁更新的问题。
  - 调整后，需要注意`路由参数`和`表单参数`的行为
    - 表单配置`展示`的筛选项无法`手动`从路由上新增参数 (原则上，无论表单项展示与否，其对应key在路由上的参数都不支持手动修改) (从0.2.0开始可手动从路由上新增了)
    - 点击`重置`可以清除隐藏的表单项的筛选条件 (点击搜索按钮不会清除，支持分享链接场景点开后还可以在此基础上修改筛选条件)
    - 筛选表单项有值时不允许设置隐藏，需要先清空数据后再操作隐藏
  - 修复点击 搜索/重置 按钮 会多次触发请求的问题
  - 修复 表单筛选值 处理 `,1` 多选场景下（例如CheckBox、Select多选）值处理的问题
  - `columns[].filterMultiple` 可不配置，会根据配置的 `columns[].type` 判断是否是多选处理

---

## 0.1.17

### Changed

- 优化 RestTable 在没有筛选条件场景下 tools 按钮的位置样式。

---

## 0.1.16

### Fixed

- 无论如何设置 parseOptions，确保 RestTable 中处理 page和page_size 一定是int类型。
- 修复 `parseQueryTypes` 未正确处理数组值的问题。

---

## 0.1.15

### Fixed

- 修复 RestTable 点击搜索时 未重置 页码`page=1` 的问题。
- requests 请求 被取消时 不提示弹窗。

### Added

- requests 增加export `reqInterceptor` 和 `resInterceptor`，可在合适的时候移除拦截器。

---

## 0.1.14

### Fixed

- 修复 RestSelect 不配置 restful 的情况下不应触发远程调用。

---

## 0.1.13

### Added

- 调整 RestTable 组件中 advancedSearch 参数控制搜索字段的展示。

### Fixed

- RouteBaseTable 需要透传 ref 参数，解决调用 RestTable 中组件方法的问题。
- 修复 RestTable 通过 ref 调用 refreshList 丢失参数的问题 (变个了函数顺序，依赖的函数放使用地方的上面)。
- RestTable 增加 `parseOptions` 和 `parseTypes` 可以配置处理 query 参数。
  - query-string 在 本项目中默认设置了 `parseNumbers: true`
  - 虽然是 RestTable 增加的配置，但主要是在 RouteBaseTable 中用到将query参数转换成object
  - 在处理query中有超大数值会有溢出精度问题，可以设置为 False 当做字符串处理
- RestTable 的 onFiltersChange 在处理回调值时`移除`跟 baseParams 和 forceParams 相同的值。
  - 避免还原为原来值的情况下显示在路由上

---

## 0.1.12

### Changed

- 调整 TableSelect 内2个元素之间的间隔。

### Fixed

- 修复 TableSelect也能够直接开启高级搜索。
- 兼容 DataStrPicker、RangeStrPicker 组件 在v4(moment)和v5(dayjs) 上时间处理的问题。
- 移除 RestTable 的 tools.advancedDefaultOpen 配置项，设置默认是否开启高级筛选配置 filterFormProps?.advancedSearch。

### Added

- GridForm 增加配置 submitTitle 和 resetTitle 可配置按钮显示。
- 新增 RouteBaseTable 为表单与路由联动提供支持。

---

## 0.1.11

### Changed

- 修复 LongText / RestTable 组件文本样式。
  - `white-space: pre-wrap; word-break: break-all` 组合用于文本显示，主要是增加了 word-break
- makeSafeRequest 优化 delay 模式下，长时间未请求后的一次请求不会执行delay逻辑。

### Fixed

- 修复 RestTable 刷选表单未正常渲染 baseParams 设置的筛选值问题。

---

## 0.1.10

### Fixed

- 修复RestTable tools配置为空时样式问题。
  - tools配置的显示依赖配置restful
  - 筛选Tag兼容antd 4.x版本显示是设置 closable

### Added

- 增加了 validators 可应用于表单校验。
  - expansionValidator: ExpansionView 组件的校验
  - remoteValidator: 配置远端接口校验数据

### Changed

- makeSafeRequest 配置 delay 防抖的情况下，优化首次请求不执行delay。

---

## 0.1.9

### Added

- 扩展 RestTable。
  - 配置 extraTools 可以自定义其他操作按钮
  - 配置 tools.advancedDefaultOpen 可以定义默认打开高级搜索
  - 配置 columns.expandable 定义是否启用展开功能
  - columns.fieldValue 变更为 columns.copyField

### Fixed

- 修复 GridForm 关闭高级搜索时选项初始化的问题。

---

## 0.1.8

### Fixed

- 修复RestTable header筛选选择多值初始化数据的问题。

---

## 0.1.7

### Changed

- 调整 RestTable 中 showHeaderTags 的样式。

---

## 0.1.5

### Added

- 扩展 RestTable 配置 showHeaderTags 可显示表头筛选值。

---

## 0.1.4

### Added

- 扩展 RestTable。
  - 刷选类型 type 扩展支持 FieldType.DATE_RANGE_PICKER 时间筛选

### Fixed

- 修复 RestTable cloumns.filterMultiple 默认值时处理数组数据问题。
- 调整 RangeStrPicker 增加默认值 `allowClear={true}` `allowEmpty={[true, true]}`。

---

## 0.1.3

### Added

- 扩展 RestTable。
  - 刷选类型 type 扩展支持 FieldType.NUMBER 和 FieldType.NUMBER_RANGE

### Fixed

- 修复 RestTable 个别问题。
  - 修复刷选输入 placeholder 的展示
  - 本地开启搜索必须配置 dropdownLocalConfig

---

## 0.1.2

### Added

- 扩展TableSelect。
  - 配置 titleAggPath 支持选中数据根据字段聚合统计显示在title上
- 扩展 LongText。
  - 配置 titleTemplate 、titleAggPath 可以统计数量展示

---

## 0.1.1

### Fixed

- 扩展 RestTable。
  - 配置 defaultPageSize 初始化 pagination 中的页码
  - 配置 dropdownLocalConfig 设置前端table搜索条件，详见 commonFilter 的实现
- 扩展 TableSelect。
  - 配置 titleTemplate 配置选中个数的模板标题展示
  - 配置 antdTableReadProps 设置只读Table的属性

---

## 0.1.0 (2025-07-07)

- Build: lib发版


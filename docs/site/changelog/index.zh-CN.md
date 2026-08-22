# 更新日志

本文件记录项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.5](https://github.com/skylerhu/antd-restful/compare/v1.0.4...v1.0.5) - 2026-08-22

### Added

- 全量英文文档：`docs/site/` 所有页面新增英文版，`*.zh-CN.md` 作为中文翻译版本。
- 新增 `docs/ARCHITECTURE.md` 和 `docs/ARCHITECTURE.zh-CN.md` 项目架构文档。
- 新增 `docs/CONTRIBUTING.zh-CN.md` 中文贡献指南。
- Dumi 文档站支持中英文国际化切换（顶部导航栏切换语言）。

### Changed

- 语言切换链接不再自链当前语言，当前语言以纯文本显示。
- `core-js` 从 `dependencies` 移至 `devDependencies` — 仅在开发/测试阶段使用（通过 `babel.config.js`），发布产物不包含。

---

## [1.0.4](https://github.com/skylerhu/antd-restful/compare/v1.0.3...v1.0.4) - 2026-08-11

### Added

- `CompareEdit` 新增 `getValueFromEvent` 和 `valuePropName` 属性，自动兼容 antd 原生组件 `onChange` 回调差异（如 `Input` 的 `e.target.value`、`Checkbox` 的 `e.target.checked`），对齐 `Form.Item` 的值提取逻辑。
- `CompareEdit` 自动转发子组件原始 `onChange` 回调，避免子组件内部逻辑丢失。

### Docs

- `docs/site/formitems/` 所有组件文档增加编辑/只读/禁用交互切换按钮，Demo 使用 `Form.Item` 水平布局展示。
- `overview.md` 新增所有表单项综合示例，配置远程数据源（`dummyjson.com`），支持提交（Modal 展示 JSON）和重置操作。
- `compare-edit.md` 补充 `onChange` 兼容说明与完整 Demo。

### Tests

- 新增 `CompareEdit` 在 `Input`、`Switch`、`Checkbox`、`Checkbox.Group` 及自定义 `getValueFromEvent` 场景的单元测试。

---

## [1.0.3](https://github.com/skylerhu/antd-restful/compare/v1.0.2...v1.0.3) - 2026-08-10

### Changed

- `RestList` 优化 `grid.column` 整除校验逻辑：增加 `filtersInited` 前置判断避免 filters 未初始化时误检；延迟 1 秒执行避免初始化阶段干扰；日志级别从 `console.error` 改为 `console.warn`。

---

## [1.0.2](https://github.com/skylerhu/antd-restful/compare/v1.0.1...v1.0.2) - 2026-08-09

### Added

- `src/config.js` 新增全局文案配置 `textOptions`，并提供 `setTextOptions` 用于统一设置组件按钮与空数据提示文案。

### Changed

- `GridForm` 的默认按钮文案改为读取 `textOptions`（`btnSubmitTitle`、`btnResetTitle`），单项模式提交按钮也改为复用该配置。
- `MentionView`、`RestAutoComplete`、`RestTreeSelect` 的 `notFoundContent` 默认文案统一读取 `textOptions.notFoundContent`。
- `RestTreeSelect` 在 `enableCopy=true` 场景下补充 `TreeSelect` 的默认宽度 `style={{ width: "100%" }}`，避免未传样式时控件宽度不稳定。
- 包入口 `src/entry.js` 新增导出 `textOptions` 与 `setTextOptions`，便于业务侧统一配置。

### Docs

- 更新 `tools/config` 与 `components/grid-form` 文档，补充 `textOptions`、`setTextOptions` 以及按钮文案默认值来源说明。

### Tests

- `tests/config.test.jsx` 新增 `textOptions` 默认值与 `setTextOptions` 更新行为测试。
- `tests/GridForm.test.jsx` 新增默认按钮文案读取 `textOptions`、单项模式按钮文案读取 `textOptions` 的测试用例。

---

## [1.0.1](https://github.com/skylerhu/antd-restful/compare/v1.0.0...v1.0.1) - 2026-08-09

### Added

- 新增 `src/common/versionUtil.js`，统一导出 `antd` 主版本判断能力（`antdMajorVersion`、`isAntd5Plus`、`isAntd6Plus`）。
- 新增 `test-utils/testVersion.js`，用于测试环境按 `ANTD_TEST_VERSION` 注入版本行为。
- 新增 `.github/workflows/test-antd6.yml`，在 CI 中安装 `antd@6` 与 `@ant-design/icons@6` 并执行完整测试。

### Changed

- `README.md` 补充兼容范围说明：支持 `antd >= 4.24`，并明确 antd5/antd6 测试覆盖。
- 多个组件（如 `RestTable`、`RestList`、`FieldsSetting`、`CompareEdit`、`ExpansionView`、`TableSelect`、`UploadView`）统一兼容 `Space` 在 antd6 的 `orientation` 参数，同时向下兼容旧版 `direction`。
- `MentionView` 在 antd6 分支启用 `loading` + `options` 方案，避免旧 API 差异导致行为不一致。
- demo 侧适配 antd API 变化：`Tabs` 根据版本切换 `destroyOnHidden`/`destroyInactiveTabPane`，并统一使用版本工具判断时间库与页面能力。
- `GridForm`、`RestTable`、`RestList`、`RouteBaseTable` 清理 `props.ref` 兜底分支，仅保留 `forwardRef` 路径以避免无效 ref 声明。

### Fixed

- `dateUtils` 直接移除 `detectAntdVersion` 导出，统一由 `versionUtil.antdMajorVersion` 提供版本判断，避免重复 API 与版本来源分散。

### Tests

- `setupTests.js` 增加 `ResizeObserver`、`MessageChannel`、`scrollIntoView` 等运行时补丁，并在非 antd5 场景跳过 snapshot 断言，降低跨版本测试噪声。
- 多个测试文件更新 `antd` mock 版本注入逻辑，确保在 antd5/antd6 下分支行为可重复验证。

---

## [1.0.0](https://github.com/skylerhu/antd-restful/releases/tag/v1.0.0) - 2026-08-08

### Added

- `RouteBaseTable`、`RestTable`、`RestList`、`GridForm` 增加 `props.ref` 与 `forwardRef` 的合并处理（`resolvedRef`），并补充 `ref` 的 `propTypes` 声明。
- 新增 `.fatherrc.ts`，用于 father 构建配置。
- 新增 `docs/FAQ.md`，记录 Node 12 环境下 `query-string` 语法报错的处理方案。

### Changed

- 构建脚本由 webpack 切换为 `father build`。
- 包入口调整为 `main=dist/cjs/index.js`、`module=dist/esm/index.js`，并新增 `exports`（`import`/`require`）映射 ESM/CJS 产物。
- `jsconfig.json` 更新为 `target/module = es2020`，并补充 `@/*`、`src/*`、`demo/*` 路径映射。
- 依赖声明调整：`peerDependencies` 放宽到 `react/react-dom >=16`、`axios >=1.0.0`，并加入 `dayjs`/`moment`。
- 多个 `dependencies` 从宽泛版本范围（如 `^x`）改为明确版本范围。
- `src` 下多处模块导入由 `src/...` 别名改为相对路径导入，适配当前构建与产物结构。
- `README.md` 的 changelog 链接切换到 `docs/CHANGELOG-1.x.md`，并补充 ESM/CommonJS 使用说明、可选日期库说明与 FAQ 入口。
- `docs/CONTRIBUTING.md` 增加 `yalc` 本地联调流程与 father 发版说明。


---

查看 0.x 历史日志：[0.x 版本日志](./v0-x.md)

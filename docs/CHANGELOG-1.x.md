# Changelog

本文件记录该项目的所有重要变更。

格式遵循 [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)，
版本号遵循 [Semantic Versioning](https://semver.org/spec/v2.0.0.html)。

## [Unreleased](https://github.com/skylerhu/antd-restful/compare/v1.0.1...HEAD)

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

- `dateUtils.detectAntdVersion` 改为复用统一版本解析逻辑，避免版本字符串分散解析带来的不一致风险。

### Tests

- `setupTests.js` 增加 `ResizeObserver`、`MessageChannel`、`scrollIntoView` 等运行时补丁，并在非 antd5 场景跳过 snapshot 断言，降低跨版本测试噪声。
- 多个测试文件更新 `antd` mock 版本注入逻辑，确保在 antd5/antd6 下分支行为可重复验证。



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


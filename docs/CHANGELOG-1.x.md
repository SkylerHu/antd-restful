# Release Notes

## 1.0.0

### Build / Dependencies
- 构建产物调整为双入口：`main=dist/cjs/index.js`、`module=dist/esm/index.js`，并新增 `exports` 显式区分 `import` / `require`。
- 构建链路切换为 `father build`，统一输出 ESM + CJS 产物。
- 依赖声明补充与规范：`peerDependencies` 新增 `dayjs`、`moment`（`optional`），并细化 `axios/react/react-dom` 的版本范围。
- 工程配置更新：补充 `jsconfig.json` 的路径映射（`@/*`、`src/*`、`demo/*`）。

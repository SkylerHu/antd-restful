# Release Notes

## 1.0.0

### feat

- `RouteBaseTable`、`RestTable`、`RestList`、`GridForm` 增加 `props.ref` 与 `forwardRef` 的合并处理（`resolvedRef`），并补充 `ref` 的 `propTypes` 声明。

### build

- 新增 `.fatherrc.ts`，构建脚本由 webpack 切换为 `father build`。
- 包入口调整为 `main=dist/cjs/index.js`、`module=dist/esm/index.js`，并新增 `exports`（`import`/`require`）映射 ESM/CJS 产物。
- `jsconfig.json` 更新为 `target/module = es2020`，并补充 `@/*`、`src/*`、`demo/*` 路径映射。

### chore

- 依赖声明调整：`peerDependencies` 放宽到 `react/react-dom >=16`、`axios >=1.0.0`，并加入 `dayjs`/`moment`。
- 多个 `dependencies` 从宽泛版本范围（如 `^x`）改为明确版本范围。
- `src` 下多处模块导入由 `src/...` 别名改为相对路径导入，适配当前构建与产物结构。

### docs

- `README.md` 的 changelog 链接切换到 `docs/CHANGELOG-1.x.md`，并补充 ESM/CommonJS 使用说明、可选日期库说明与 FAQ 入口。
- 新增 `docs/FAQ.md`，记录 Node 12 环境下 `query-string` 语法报错的处理方案。
- `docs/CONTRIBUTING.md` 增加 `yalc` 本地联调流程与 father 发版说明。

# Release Notes

## 1.0.0

### Build / Dependencies
- 统一产物入口：`main` 指向 `dist/cjs/index.js`，`module` 指向 `dist/esm/index.js`，新增 `exports` 显式区分 `import` / `require`。
- 构建命令切换为 `father build`，产出 ESM + CJS 双格式产物，保持 npm 包消费端兼容性。
- 统一并补充依赖声明：在 `peerDependencies` 中新增 `dayjs`、`moment`（保持 optional），并规范 `axios` 版本声明。
- 更新工程配置：补充 `jsconfig.json` 中的 `@/*` 与 `demo/*` 路径映射，保持与构建别名一致。

### Fixes
- 修复 `dateUtils` 中可选时间库的加载方式，改为运行时动态加载 `moment` / `dayjs`，避免下游项目在未安装对应可选依赖时出现 `Module not found` 编译告警。

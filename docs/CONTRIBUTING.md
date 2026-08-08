# 前言
主要是给开发者阅读，描述开发前后需要注意的一些事项。

# 开发环境

    node: 18.20.8

常用命令：
- 安装依赖 `npm install .`
- 本地联调（mock + demo）`npm run start`
- 组件库打包（father，输出 ESM + CJS）`npm run build`
- 旧版 webpack 打包（已废弃，不用于发版）`npm run build:webpack`
- 测试用例 `npm run test`
- 发版 `npm publish`

## 使用 yalc 本地联调

当你需要在业务项目中联调本仓库的最新改动时，建议使用 `yalc`，避免频繁发 npm 测试版本。

1. 首次安装（全局）：
   - `npm i -g yalc`
2. 在本仓库打包并发布到本地 yalc 仓库：
   - `npm run build`
   - `yalc publish`
3. 在业务项目中引入本地包：
   - `yalc add antd-restful`
   - `npm install`
4. 本仓库有新改动后，在业务项目中同步：
   - 在本仓库重新执行 `yalc publish`
   - 在业务项目执行 `yalc update antd-restful && npm install`

联调结束后，业务项目可回退到 npm 正式版本：
- `yalc remove antd-restful`
- `npm install antd-restful`

# 提交Pull Request
提交Pull Request之前需要检查以下事项是否完成：
- 需包含测试用例，并通过`npm run test`

# 打包发版

打包产物目录：
- `dist/esm`（ESM）
- `dist/cjs`（CJS）

father 构建行为说明：
- 当前仅使用 father 的 ESM/CJS `bundless` 转译模式，不做 UMD 单文件打包。
- 该模式会保留依赖的 `import/require`，不会把业务依赖内联成一个大 bundle。
- 该模式不走 terser 压缩改名流程，因此不会因为压缩导致类名/方法名被混淆。

发版流程：
1. `npm run build`
2. `npm publish`

废弃说明：
- `npm run build:webpack` 为历史兼容脚本，产物入口与当前包入口定义不一致。
- `build:webpack` 的旧入口文件为 `dist/index.js`（webpack 产物）。
- 当前 `package.json` 入口为 `main=dist/cjs/index.js`、`module=dist/esm/index.js`，对应 father 产物。
- 若使用 `build:webpack` 会生成不同结构的旧产物，不应作为 npm 发版产物，后续计划移除该脚本。

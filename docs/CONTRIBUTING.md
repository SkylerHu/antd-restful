# 前言
主要是给开发者阅读，描述开发前后需要注意的一些事项。

# 开发环境

    node: 18.20.8

常用命令：
- 安装依赖 `npm install .`
- 本地联调（mock + demo）`npm run start`
- 测试用例 `npm run test`

构建和发版通过 Makefile 执行（自动切换到 Node 18）：

| 命令 | 说明 |
|---|---|
| `make build` | 构建主版本（father ESM + CJS → `dist/`） |
| `make build-compat` | 构建兼容版本（webpack UMD → `compat/dist/`） |
| `make publish` | 构建 + 发布主版本（latest 标签） |
| `make publish-compat` | 构建 + 发布兼容版本（compat 标签） |
| `make clean` | 清理所有构建产物 |

## 本地其他项目联调

当你需要在业务项目中联调本仓库的最新改动时，有以下两种方式。

### 方式一：npm link

无需额外安装工具，利用 npm 自带的符号链接机制：

1. 在本仓库构建并创建全局链接：
   ```bash
   make build
   npm link
   ```
2. 在业务项目中链接本地包：
   ```bash
   npm link antd-restful
   ```
3. 本仓库有新改动后，重新构建即可（业务项目自动读取最新产物）：
   ```bash
   make build
   ```
4. 联调结束后，在业务项目中取消链接并恢复 npm 版本：
   ```bash
   npm unlink antd-restful
   npm install antd-restful
   ```

> **注意**：`npm link` 使用符号链接，可能因为 `react` 存在多实例（本仓库和业务项目各有一份）导致 hooks 报错。如遇到此问题，推荐使用 yalc。

### 方式二：yalc（推荐）

`yalc` 模拟真实安装流程，将包拷贝到业务项目的 `node_modules` 中，避免符号链接带来的多实例问题。

1. 首次安装（全局）：
   ```bash
   npm i -g yalc
   ```
2. 在本仓库打包并发布到本地 yalc 仓库：
   ```bash
   make build
   yalc publish
   ```
3. 在业务项目中引入本地包：
   ```bash
   yalc add antd-restful
   npm install
   ```
4. 本仓库有新改动后，在业务项目中同步：
   ```bash
   yalc publish              # 在本仓库执行
   yalc update antd-restful && npm install  # 在业务项目执行
   ```

联调结束后，业务项目可回退到 npm 正式版本：
```bash
yalc remove antd-restful
npm install antd-restful
```

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
```bash
make publish
```

## 发布兼容版本（0.x）

`0.x` 版本线用于发布 Node 12 / npm 6 兼容版本，供无法升级 Node 的老项目使用。兼容版本从 `0.5.0` 开始。

兼容版本的 `package.json` 独立存放在 `compat/` 目录，通过 webpack 将所有依赖（含 `query-string`）打包为单文件 `compat/dist/index.js`，确保产物零外部依赖、语法兼容 Node 12。

```bash
make publish-compat
```

消费方通过 `npm install antd-restful@compat` 安装兼容版本。

> **注意**：
> - `0.x` 与主线版本（`1.x`）功能可能不完全一致，仅回移必要的 bugfix。
> - `query-string` 保持 `9.x` 即可，webpack 构建时会自动将其打包并转译为兼容语法。
> - 发布前请确认 `compat/package.json` 中的 `version` 字段已更新。

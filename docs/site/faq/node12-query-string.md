# Node 12 环境编译时报 `query-string` 语法错误怎么办？

典型报错示例：

```javascript
Failed to compile.

./node_modules/antd-restful/node_modules/query-string/base.js
Module parse failed: Unexpected token
...
url: getUrlWithoutQuery(url_ ?? ''),
```

## 原因

- 当前安装到的 `query-string` 版本包含较新的语法（如 `??` / `?.`）。
- Node 12 或旧构建链路对该语法支持不完整，导致编译阶段报错。

## 解决方案（推荐）

在使用方项目中通过包管理器覆盖依赖，强制 `antd-restful` 使用 `query-string@7.x`：

### npm（>= 8.3.0）

```json
{
  "overrides": {
    "antd-restful": {
      "query-string": "^7.1.3"
    }
  }
}
```

### npm 6 / 7（借助 npm-force-resolutions）

`overrides` 从 npm 8.3.0（随 Node.js 16 发布）才开始支持。如果你使用 Node 12（默认 npm 6），可以通过 [npm-force-resolutions](https://www.npmjs.com/package/npm-force-resolutions) 实现类似效果：

1. 安装工具并配置 `package.json`：

```json
{
  "resolutions": {
    "query-string": "^7.1.3"
  },
  "scripts": {
    "preinstall": "npx npm-force-resolutions"
  }
}
```

2. 执行 `npm install`，`preinstall` 钩子会自动将 `package-lock.json` 中对应版本改写。

> **⚠ 注意**：`npm-force-resolutions` 需要读取 `package-lock.json`。如果你刚删除了 `package-lock.json`，直接运行 `npm install` 会先触发 `preinstall` 钩子，此时文件尚不存在，将抛出：
>
> ```
> ENOENT: no such file or directory, open './package-lock.json'
> ```
>
> **解决办法**：先单独生成锁文件，再执行完整安装：
>
> ```bash
> npm install --ignore-scripts   # 跳过钩子，仅生成 package-lock.json
> npm install                    # 此时 preinstall 钩子可正常运行
> ```

### pnpm

```json
{
  "pnpm": {
    "overrides": {
      "query-string": "^7.1.3"
    }
  }
}
```

### yarn

```json
{
  "resolutions": {
    "query-string": "^7.1.3"
  }
}
```

配置后重新安装依赖，并通过 `npm ls query-string`（或 `pnpm why query-string` / `yarn why query-string`）确认生效版本。

> 注意：如果之前已经安装过 `query-string@9.x`，需要删除 `node_modules` 和锁文件后重新安装，覆盖规则才会稳定生效。

## 备选方案

若你必须使用 `query-string@9`，请确保满足以下至少一项：

- 升级运行环境到 Node 18+。
- 在消费项目构建配置中将 `query-string` 纳入 Babel 转译范围（例如 webpack 中对白名单包做转译）。

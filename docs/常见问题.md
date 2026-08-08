# 常见问题 (FAQ)

## Node 12 环境编译时报 `query-string` 语法错误怎么办？

典型报错示例：

```text
Failed to compile.

./node_modules/antd-restful/node_modules/query-string/base.js
Module parse failed: Unexpected token
...
url: getUrlWithoutQuery(url_ ?? ''),
```

### 原因

- 当前安装到的 `query-string` 版本包含较新的语法（如 `??` / `?.`）。
- Node 12 或旧构建链路对该语法支持不完整，导致编译阶段报错。

### 解决方案（推荐）

在使用方项目中通过包管理器覆盖依赖，强制 `antd-restful` 使用 `query-string@7.x`：

### npm
```json
{
  "overrides": {
    "antd-restful": {
      "query-string": "^7.1.3"
    }
  }
}
```

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

### 备选方案

若你必须使用 `query-string@9`，请确保满足以下至少一项：

- 升级运行环境到 Node 18+。
- 在消费项目构建配置中将 `query-string` 纳入 Babel 转译范围（例如 webpack 中对白名单包做转译）。
